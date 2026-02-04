const Booking = require("../Models/booking.model");
const Listing = require("../Models/listing.model");
const User = require("../Models/user.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const sendMail = require("../Utils/nodemailer");

// Create a Stripe Checkout Session
exports.createCheckoutSession = async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, guests } = req.body;
    const listing = await Listing.findById(listingId);

    if (!listing) return res.status(404).json({ message: "Listing not found" });

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (isNaN(checkInDate) || isNaN(checkOutDate) || checkInDate >= checkOutDate) {
      return res.status(400).json({ message: "Invalid check-in/check-out dates" });
    }

    // Check availability (only block if already PAID)
    const overlappingBooking = await Booking.findOne({
      listingId,
      status: "paid",
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: "Selected dates are already booked" });
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)) || 1;
    const totalAmount = listing.pricePerNight * nights + (listing.cleaningFee || 0);

    // Create session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: listing.title,
              description: `Booking for ${nights} nights at ${listing.location.city}`,
              images: listing.images.length > 0 ? [listing.images[0]] : [],
            },
            unit_amount: Math.round(totalAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/listing/${listingId}`,
      metadata: {
        listingId: listing._id.toString(),
        guestId: req.user._id.toString(),
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        guests: guests.toString(),
        totalAmount: totalAmount.toString()
      },
    });

    // We can still create a pending booking or just wait for webhook
    // To keep it "lean", many tutorials just wait for the success page to do something, 
    // but a real app needs a webhook. I'll keep the webhook but simplify it.

    await Booking.create({
      listingId,
      hostId: listing.hostId,
      guestId: req.user._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalAmount,
      stripePaymentIntentId: session.id, // Store session ID here instead
      status: "pending",
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe Session Error:", err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

// Webhook (Disabled for Local Dev, relies on /check-status fallback instead)
exports.handleWebhook = async (req, res) => {
  res.json({ message: "Webhook received (Local dev: no-op)" });
};

// Primary status check mechanism (Reliable for Local & Prod)
exports.checkStatus = async (req, res) => {
  const { sessionId } = req.params;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const booking = await Booking.findOne({ stripePaymentIntentId: sessionId }).populate("listingId guestId");

      if (booking && booking.status !== "paid") {
        // 1. Update status
        booking.status = "paid";
        await booking.save();

        // 2. Fire Confirmation Email
        try {
          const checkInStr = new Date(booking.checkIn).toLocaleDateString();
          const checkOutStr = new Date(booking.checkOut).toLocaleDateString();
          const listing = booking.listingId;

          await sendMail(
            booking.guestId.email,
            "Booking Confirmed! - Airbnb",
            `Your stay at ${listing.title} is confirmed for ${checkInStr} to ${checkOutStr}.`,
            `
              <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
                <div style="background-color: #ff385c; padding: 40px 20px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">Pack your bags!</h1>
                  <p style="color: rgba(255,255,255,0.9); margin-top: 10px; font-size: 16px;">Your reservation at ${listing.title} is confirmed.</p>
                </div>
                
                <div style="padding: 30px;">
                  <div style="margin-bottom: 30px;">
                    <img src="${listing.images?.[0] || 'https://via.placeholder.com/600x300'}" style="width: 100%; height: auto; border-radius: 12px; object-fit: cover; aspect-ratio: 16/9;" />
                    <h2 style="margin: 20px 0 5px 0; color: #222; font-size: 22px;">${listing.title}</h2>
                    <p style="margin: 0; color: #717171; font-size: 15px;">Stay confirmed for: ${checkInStr} - ${checkOutStr}</p>
                  </div>

                  <div style="padding: 25px 0; border-top: 1px solid #f0f0f0;">
                    <h3 style="font-size: 17px; color: #222; margin: 0 0 15px 0; font-weight: 700;">Billing Details</h3>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                      <span style="color: #717171;">Status</span>
                      <span style="color: #222; font-weight: bold; color: #2ecc71;">PAID</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 18px;">
                      <span style="color: #222; font-weight: 700;">Total Paid</span>
                      <span style="color: #222; font-weight: 800;">$${booking.totalAmount}</span>
                    </div>
                  </div>

                  <a href="${process.env.CLIENT_URL}/bookings" style="display: block; text-align: center; background: linear-gradient(to right, #ff385c, #e31c5f); color: #ffffff; padding: 16px; text-decoration: none; border-radius: 12px; font-weight: 700; margin-top: 10px; font-size: 16px;">Manage Reservation</a>
                </div>
              </div>
              `
          );
          console.log("Status check: Email fired successfully.");
        } catch (mailErr) {
          console.error("Status check: Failed to send mail", mailErr);
        }
      }
      return res.status(200).json({ status: "paid", booking });
    }

    res.status(200).json({ status: session.payment_status });
  } catch (err) {
    console.error("Check Status Error:", err);
    res.status(500).json({ message: "Error verifying payment" });
  }
};

exports.getBookingById = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findById(id).populate("listingId guestId");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

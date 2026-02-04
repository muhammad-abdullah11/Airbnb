const Listing = require("../Models/listing.model");
const Booking = require("../Models/booking.model");

// Merge overlapping periods helper
function mergePeriods(periods = []) {
  const mapped = periods
    .map(p => ({ start: new Date(p.startDate).getTime(), end: new Date(p.endDate).getTime() }))
    .filter(p => !isNaN(p.start) && !isNaN(p.end) && p.end > p.start)
    .sort((a, b) => a.start - b.start);

  if (!mapped.length) return [];

  const merged = [mapped[0]];
  for (let i = 1; i < mapped.length; i++) {
    const last = merged[merged.length - 1];
    const cur = mapped[i];
    if (cur.start <= last.end) {
      last.end = Math.max(last.end, cur.end);
    } else {
      merged.push(cur);
    }
  }
  return merged.map(m => ({ startDate: new Date(m.start), endDate: new Date(m.end) }));
}

// Get unavailable (booked + pending) periods for a listing
exports.getUnavailablePeriods = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    const bookings = await Booking.find({ listingId: id, status: { $in: ["pending", "paid"] } });
    const allPeriods = bookings.map(b => ({ startDate: b.checkIn, endDate: b.checkOut }));

    // add manual host availability overrides if any
    if (listing.availability && listing.availability.length > 0) {
      listing.availability.forEach(a => allPeriods.push({ startDate: a.startDate, endDate: a.endDate }));
    }

    const merged = mergePeriods(allPeriods);

    res.status(200).json({ message: "Unavailable periods fetched", periods: merged });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new listing
module.exports.createListing = async (req, res) => {
  const { title, description, pricePerNight, location, address, amenities, houseRules, maxGuests, bedrooms, bathrooms } = req.body;

  if (!title || !description || !pricePerNight || !location || !address) {
    return res.status(400).json({ message: "All required fields must be filled!" });
  }

  try {
    let images = [];
    if (req.files) {
      images = req.files.map(file => file.path); // store URLs/paths
    }

    const listing = new Listing({
      hostId: req.user._id,
      title,
      description,
      pricePerNight,
      cleaningFee: req.body.cleaningFee || 0,
      location: {
        address,
        city: location.city || "",
        country: location.country || "",
        lat: location.lat || 0,
        lng: location.lng || 0
      },
      images,
      amenities: amenities || [],
      houseRules: houseRules || [],
      maxGuests: maxGuests || 1,
      bedrooms: bedrooms || 1,
      bathrooms: bathrooms || 1,
      availability: []
    });

    await listing.save();
    res.status(201).json({ message: "Listing created successfully", listing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch listing by ID
module.exports.getListingById = async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id).populate("hostId", "name email");
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.status(200).json({ message: "Listing fetched successfully", listing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch all active listings
module.exports.getAllActiveListings = async (req, res) => {
  try {
    const listings = await Listing.find().populate("hostId", "name email");
    res.status(200).json({ message: "Active listings fetched successfully", listings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch listings by location
module.exports.getListingsByLocation = async (req, res) => {
  const { location } = req.params;
  try {
    const listings = await Listing.find({ "location.city": location }).populate("hostId", "name email");
    if (!listings.length) return res.status(404).json({ message: "No listings found for this location" });
    res.status(200).json({ message: "Listings fetched successfully", listings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch all listings of logged-in user
module.exports.getLoginUserListings = async (req, res) => {
  try {
    const listings = await Listing.find({ hostId: req.user._id }).populate("hostId", "name email");
    res.status(200).json({ message: "Login User listings fetched successfully", listings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


const fs = require("fs");
const path = require("path");

// Update listing controller
exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;

    // Destructure fields
    const {
      title,
      description,
      pricePerNight,
      maxGuests,
      bedrooms,
      beds,
      bathrooms,
      amenities,
      houseRules,
      existingImages // array of URLs the host wants to keep
    } = req.body;

    // Validate required fields
    if (!title || !description || !pricePerNight) {
      return res.status(400).json({
        message: "Title, description, and price are required",
      });
    }

    // Handle uploaded images (req.files from multer)
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedImages = req.files.map(file => file.path); // save paths to DB
    }

    // Combine existing images + new uploads
    const finalImages = existingImages
      ? [...existingImages, ...uploadedImages]
      : uploadedImages;

    // Prepare updated data
    const updateData = {
      title,
      description,
      pricePerNight,
      maxGuests: maxGuests || 1,
      bedrooms: bedrooms || 1,
      beds: beds || 1,
      bathrooms: bathrooms || 1,
      amenities: Array.isArray(amenities) ? amenities : [],
      houseRules: Array.isArray(houseRules) ? houseRules : [],
      images: finalImages,
    };

    // Optional: update availability if provided (array of { startDate, endDate })
    if (req.body.availability) {
      try {
        const parsed = Array.isArray(req.body.availability)
          ? req.body.availability
          : JSON.parse(req.body.availability);
        updateData.availability = parsed
          .map(p => ({
            startDate: p.startDate ? new Date(p.startDate) : undefined,
            endDate: p.endDate ? new Date(p.endDate) : undefined
          }))
          .filter(p => p.startDate && p.endDate && p.endDate > p.startDate);
      } catch (e) {
        // ignore parsing errors and skip availability update
        console.warn('Invalid availability format; skipping availability update');
      }
    }
    // Update in DB
    const updatedListing = await Listing.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json({
      message: "Listing updated successfully",
      listing: updatedListing,
    });
  } catch (err) {
    console.error("Update listing error:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Delete a listing
exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findByIdAndDelete(id);

    if (!listing) return res.status(404).json({ message: "Listing not found" });

    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
// Search listings with filters (location, guests, dates)
exports.searchListings = async (req, res) => {
  try {
    const { location, checkIn, checkOut, guests } = req.query;

    let query = {};

    // 1. Location filter
    if (location && location !== "Search destinations") {
      query["location.city"] = { $regex: location, $options: "i" };
    }

    // 2. Guest filter
    if (guests) {
      query.maxGuests = { $gte: parseInt(guests) };
    }

    // Fetch listings matching location and guests first
    let listings = await Listing.find(query).populate("hostId", "name email");

    // 3. Date filtering logic (Availability check)
    if (checkIn && checkOut && checkIn !== "Add dates") {
      const searchStart = new Date(checkIn);
      const searchEnd = new Date(checkOut);

      if (!isNaN(searchStart.getTime()) && !isNaN(searchEnd.getTime())) {
        // Find all bookings that overlap with requested dates
        const conflictingBookings = await Booking.find({
          status: { $in: ["paid", "pending"] },
          checkIn: { $lt: searchEnd },
          checkOut: { $gt: searchStart }
        }).select("listingId");

        const bookedListingIds = conflictingBookings.map(b => b.listingId.toString());

        // Filter out listings that are booked
        listings = listings.filter(listing => !bookedListingIds.includes(listing._id.toString()));
      }
    }

    res.status(200).json({
      message: "Filtered listings fetched successfully",
      listings,
      count: listings.length
    });
  } catch (err) {
    console.error("Search listings error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

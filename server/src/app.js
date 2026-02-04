const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
app.use(express.json({
    verify: (req, res, buf) => {
        if (req.originalUrl.includes('/webhook')) {
            req.rawBody = buf;
        }
    }
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// api routes
const userRoutes = require("./Routes/user.routes");
const listingRoutes = require("./Routes/listing.routes");
const reviewRoutes = require("./Routes/review.routes");
const bookingRoutes = require("./Routes/booking.routes");

//endpoints
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/listings", listingRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/bookings", bookingRoutes);


// error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || "Internal server error",
        error: process.env.NODE_ENV === "development" ? err : {}
    });
});

module.exports = app;
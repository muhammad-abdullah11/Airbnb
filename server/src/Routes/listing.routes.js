const express = require("express");
const router = express.Router();
const { upload } = require("../Middlewares/upload");
const { isLogin } = require("../Middlewares/auth.middlewares");
const {
    createListing, getListingById, getAllActiveListings, getListingsByLocation,
    getLoginUserListings,
    updateListing,
    deleteListing,
    getUnavailablePeriods,
    searchListings
} = require("../Controllers/listing.controller");


router.post("/create", isLogin, upload.array("images", 5), createListing);
router.put("/update/:id", isLogin, upload.array("images", 5), updateListing);
router.delete("/delete/:id", isLogin, deleteListing);
router.get("/search", searchListings);
router.get("/listing/:id", getListingById);
// Return unavailable/booked periods for calendar blocking
router.get("/listing/:id/unavailable", getUnavailablePeriods);
router.get("/active", getAllActiveListings);
router.get("/base-location/:location", getListingsByLocation);
router.get("/user-listings", isLogin, getLoginUserListings);

module.exports = router;

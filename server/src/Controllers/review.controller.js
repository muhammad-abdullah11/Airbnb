const Listing = require('../Models/listing.model');
const Review = require("../Models/review.model");
const Service = require('../Models/service.model');

// Create review
module.exports.createReview = async (req, res) => {
    const { itemType, itemId, rating, comment } = req.body;

    if (!itemType || !itemId || !rating || !comment) {
        return res.status(400).json({ message: "All required fields must be filled!" });
    }

    try {
        // Allow multiple reviews by the same user for the same item (per request)
        const review = new Review({
            userId: req.user._id,
            itemType,
            itemId,
            rating,
            comment
        });

        await review.save();
        // populate user details for immediate client display
        const populated = await Review.findById(review._id).populate('userId', 'name email avatar');
        res.status(201).json({ message: "Review added successfully", review: populated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get reviews by item
module.exports.getReviewsByItem = async (req, res) => {
    const { itemType, itemId } = req.params;

    try {
        const reviews = await Review.find({ itemType, itemId })
            .sort({ createdAt: -1 })
            .populate("userId", "name email avatar");

        res.status(200).json({ message: "Reviews fetched successfully", reviews });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete review
module.exports.deleteReview = async (req, res) => {
    const { id } = req.params;

    try {
        const review = await Review.findById(id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        // allow deletion if owner
        if (review.userId.toString() === req.user._id.toString()) {
            await review.deleteOne();
            return res.status(200).json({ message: 'Review deleted successfully' });
        }

        // allow owner of the item (listing/service) to delete reviews for their item
        if (review.itemType === 'listing') {
            const listing = await Listing.findById(review.itemId);
            if (listing && listing.hostId.toString() === req.user._id.toString()) {
                await review.deleteOne();
                return res.status(200).json({ message: 'Review deleted by host successfully' });
            }
        } else if (review.itemType === 'service') {
            const service = await Service.findById(review.itemId);
            if (service && service.providerId.toString() === req.user._id.toString()) {
                await review.deleteOne();
                return res.status(200).json({ message: 'Review deleted by service provider successfully' });
            }
        }

        return res.status(403).json({ message: 'Forbidden: not allowed to delete this review' });
    } catch (err) {
        console.error('Delete review error:', err && err.stack ? err.stack : err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

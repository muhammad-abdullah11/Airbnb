const express = require("express");
const router = express.Router();
const { isLogin } = require("../Middlewares/auth.middlewares");

const {
    createReview,
    getReviewsByItem,
    deleteReview
} = require("../Controllers/review.controller");

router.post("/create", isLogin, createReview);
router.get("/:itemType/:itemId", getReviewsByItem);
router.delete("/:id", isLogin, deleteReview);

module.exports = router;

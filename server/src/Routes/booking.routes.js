const express = require("express");
const router = express.Router();
const {
  createCheckoutSession,
  handleWebhook,
  getBookingById,
  checkStatus
} = require("../Controllers/booking.controller");
const { isLogin } = require("../Middlewares/auth.middlewares");

// Create checkout session (Leaner approach)
router.post("/create-checkout-session", isLogin, createCheckoutSession);

// Check payment status manually (Client-side success page calls this)
router.get("/check-status/:sessionId", isLogin, checkStatus);

// Get booking details
router.get("/:id", isLogin, getBookingById);

// Stripe webhook
router.post("/webhook", handleWebhook);

module.exports = router;

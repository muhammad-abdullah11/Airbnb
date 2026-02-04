const express = require("express");
const { signup, login, logout, getProfile, verifyOTP } = require("../Controllers/user.controller");
const { isLogin } = require("../Middlewares/auth.middlewares");
const router = express.Router();

router.post("/register", signup);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/logout", isLogin, logout);
router.get("/get-profile", isLogin, getProfile);

module.exports = router;
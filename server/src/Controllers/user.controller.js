const User = require("../Models/user.model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../Utils/jwtToken");
const sendMail = require("../Utils/nodemailer");


module.exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All field required!" })
  }
  try {
    const isUser = await User.findOne({ email });
    if (isUser)
      return res.status(400).json({ message: "Email already registered" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const user = new User({ name, email, password, role, otp, otpExpire });
    await user.save();

    // Send OTP via email
    try {
      await sendMail(
        email,
        "Verify your Airbnb Account",
        `Your OTP is ${otp}. It expires in 10 minutes.`,
        `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #ff385c;">Airbnb Account Verification</h2>
                    <p>Welcome to Airbnb! Please use the following One-Time Password (OTP) to verify your account:</p>
                    <div style="font-size: 24px; font-bold; color: #333; padding: 10px; background: #f9f9f9; text-align: center; border-radius: 5px;">${otp}</div>
                    <p>This OTP is valid for 10 minutes.</p>
                </div>`
      );
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
      // Optionally handle email failure (e.g., delete user or inform them to try resending)
    }

    res.status(201).json({
      message: "Registration successful. Please check your email for the OTP.",
      userId: user._id
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) return res.status(400).json({ message: "Account already verified" });

    if (user.otp !== otp || user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    const token = generateToken(user, res);
    res.status(200).json({ message: "Account verified successfully", user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All field required!" })
  }
  try {

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    if (!user.isVerified) {
      return res.status(401).json({ message: "Account not verified. Please verify your email first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user, res);
    res.status(200).json({ message: "User login successfully", user, token });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getProfile = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json("unauthorized access")
    }
    return res.status(200).json({ message: "User Profile fetch successfully ", user: req.user });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal server error" });
  }
}
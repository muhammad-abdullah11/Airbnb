const jwt = require("jsonwebtoken");

const generateToken = (user, res) => {
  try {
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "dev",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token,options);
    return token;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {generateToken}
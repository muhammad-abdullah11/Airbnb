const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["guest", "host", "service_provider", "admin"],
      default: "guest"
    },

    avatar: {
      type: String // image URL
    },

    phone: {
      type: String
    },

    bio: {
      type: String,
      maxLength: 500
    },

    isVerified: {
      type: Boolean,
      default: false
    },
    otp: {
      type: String
    },
    otpExpire: {
      type: Date
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return 0;
  this.password = await bcrypt.hash(this.password, 10);

});
const User = mongoose.model("User", userSchema);
module.exports = User;
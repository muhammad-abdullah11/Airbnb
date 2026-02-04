import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaCheckCircle } from "react-icons/fa";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "ali",
    email: "ali@gmail.com",
    password: "user1234",
    role: "guest"
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      await axios.post("/api/v1/users/register", formData);

      setSuccess("Account created! Please check your email for the OTP.");

      setTimeout(() => {
        navigate("/verify-otp", { state: { email: formData.email } });
      }, 1500);

    } catch (err) {
      setError("Network error. Please check your connection.");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-red-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <svg className="h-12 w-12 text-red-500 mx-auto mb-4" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M16 1c2 0 3.46 1.28 4.5 2.53C21.63 4.94 22 6.5 22 8c0 1.56-.88 3.22-1.97 4.97l-.1.15c-.88 1.33-1.97 2.97-2.93 4.88-1.03 2.03-1.97 4.31-2 6.94v.06c0 .55-.45 1-1 1s-1-.45-1-1v-.06c-.03-2.63-.97-4.9-2-6.94-.96-1.9-2.05-3.55-2.93-4.88l-.1-.15C6.88 11.22 6 9.56 6 8c0-1.5.37-3.06 1.5-4.47C8.54 2.28 10 1 12 1c.67 0 1.34.09 2 .28.66-.19 1.33-.28 2-.28zm0 2c-.67 0-1.35.13-2 .41-.65-.28-1.33-.41-2-.41-1.33 0-2.29.78-3 1.66C8.13 5.78 8 6.83 8 8c0 .94.63 2.28 1.66 3.94l.1.15c.85 1.28 1.88 2.84 2.8 4.66.94 1.87 1.81 4.03 1.94 6.5.13-2.47 1-4.63 1.94-6.5.92-1.82 1.95-3.38 2.8-4.66l.1-.15C20.37 10.28 21 8.94 21 8c0-1.17-.13-2.22-1-3.34-.71-.88-1.67-1.66-3-1.66z" />
          </svg>
          <h1 className="text-3xl font-bold text-gray-900">Join Airbnb</h1>
          <p className="text-gray-600 mt-2">Create your account to get started</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-6">

            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                I want to
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: "guest" }))}
                  className={`py-4 px-4 rounded-xl border-2 font-medium transition ${formData.role === "guest"
                      ? "border-red-500 bg-red-50 text-red-700 shadow-sm"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                >
                  <div className="text-2xl mb-1">🏠</div>
                  <div className="font-semibold">Book Places</div>
                  <div className="text-xs mt-1 opacity-75">As a Guest</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: "host" }))}
                  className={`py-4 px-4 rounded-xl border-2 font-medium transition ${formData.role === "host"
                      ? "border-red-500 bg-red-50 text-red-700 shadow-sm"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                >
                  <div className="text-2xl mb-1">👨‍💼</div>
                  <div className="font-semibold">List Property</div>
                  <div className="text-xs mt-1 opacity-75">As a Host</div>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <span>❌</span>
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <FaCheckCircle />
                <span>{success}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-linear-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <span
                  onClick={() => window.location.href = "/login"}
                  className="text-red-500 font-semibold hover:text-red-600 transition cursor-pointer">
                  Log in
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Terms and Privacy */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By signing up, you agree to our{" "}
          <span className="underline hover:text-gray-700 cursor-pointer">Terms of Service</span>
          {" "}and{" "}
          <span className="underline hover:text-gray-700 cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
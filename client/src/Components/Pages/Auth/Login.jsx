import axios from "axios";
import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaCheckCircle } from "react-icons/fa";

const Login = () => {
 const [formData, setFormData] = useState({
  email: "ali@gmail.com",
  password: "user1234"
});
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
  if (!formData.email || !formData.password) {
    setError("Please fill in all fields");
    setLoading(false);
    return;
  }

  try {
    const res = await axios.post("/api/v1/users/login", formData);

    const token = res.data?.token;
    const user = res.data?.user;

    if (!token || !user) {
      setError("Invalid server response. Please try again.");
      setLoading(false);
      return;
    }

    localStorage.setItem("token", token);
    setSuccess("Login successful! Redirecting...");

    // Redirect after 2 seconds (can customize per role if needed)
    setTimeout(() => {
      if (user.role === "host") {
        window.location.href = "/host-home"; // optional: separate host page
      } else {
        window.location.href = "/";
      }
    }, 2000);

  } catch (err) {
    if (err.response) {
      setError(err.response.data?.message || "Login failed. Please check your credentials.");
    } else {
      setError("Network error. Please check your connection.");
    }
    console.error("Login error:", err);
  } finally {
    setLoading(false);
  }
};

// Allow Enter key to submit
const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    handleSubmit();
  }
};

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-red-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <svg className="h-12 w-12 text-red-500 mx-auto mb-4" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M16 1c2 0 3.46 1.28 4.5 2.53C21.63 4.94 22 6.5 22 8c0 1.56-.88 3.22-1.97 4.97l-.1.15c-.88 1.33-1.97 2.97-2.93 4.88-1.03 2.03-1.97 4.31-2 6.94v.06c0 .55-.45 1-1 1s-1-.45-1-1v-.06c-.03-2.63-.97-4.9-2-6.94-.96-1.9-2.05-3.55-2.93-4.88l-.1-.15C6.88 11.22 6 9.56 6 8c0-1.5.37-3.06 1.5-4.47C8.54 2.28 10 1 12 1c.67 0 1.34.09 2 .28.66-.19 1.33-.28 2-.28zm0 2c-.67 0-1.35.13-2 .41-.65-.28-1.33-.41-2-.41-1.33 0-2.29.78-3 1.66C8.13 5.78 8 6.83 8 8c0 .94.63 2.28 1.66 3.94l.1.15c.85 1.28 1.88 2.84 2.8 4.66.94 1.87 1.81 4.03 1.94 6.5.13-2.47 1-4.63 1.94-6.5.92-1.82 1.95-3.38 2.8-4.66l.1-.15C20.37 10.28 21 8.94 21 8c0-1.17-.13-2.22-1-3.34-.71-.88-1.67-1.66-3-1.66z"/>
          </svg>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mt-2">Log in to your Airbnb account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-6">
            
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
                  onKeyPress={handleKeyPress}
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
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <span className="text-sm text-red-500 font-medium hover:text-red-600 cursor-pointer">
                Forgot password?
              </span>
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
                  <span>Logging in...</span>
                </div>
              ) : (
                "Log in"
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button className="flex items-center justify-center py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
              <button className="flex items-center justify-center py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button className="flex items-center justify-center py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.627-5.373-12-12-12"/>
                </svg>
              </button>
            </div>

            {/* Signup Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <span 
                onClick={()=>window.location.href="/signup"}
                className="text-red-500 font-semibold hover:text-red-600 transition cursor-pointer">
                  Sign up
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By continuing, you agree to Airbnb's{" "}
          <span className="underline hover:text-gray-700 cursor-pointer">Terms of Service</span>
          {" "}and{" "}
          <span className="underline hover:text-gray-700 cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
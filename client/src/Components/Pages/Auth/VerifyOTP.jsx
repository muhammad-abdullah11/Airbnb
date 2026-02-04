import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FaShieldAlt, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const VerifyOTP = () => {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate("/signup");
        }
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (otp.length !== 6) {
            setError("OTP must be 6 digits");
            setLoading(false);
            return;
        }

        try {
            const resp = await axios.post("/api/v1/users/verify-otp", { email, otp });
            setSuccess("Account verified successfully! Redirecting...");

            // Store token if needed, or redirect to login
            if (resp.data.token) {
                localStorage.setItem("token", resp.data.token);
                localStorage.setItem("user", JSON.stringify(resp.data.user));
            }

            setTimeout(() => {
                window.location.href = "/";
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Verification failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-red-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <FaShieldAlt className="h-16 w-16 text-rose-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900">Verify Email</h1>
                    <p className="text-gray-600 mt-2">
                        We've sent a 6-digit code to <span className="font-semibold text-gray-800">{email}</span>
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
                                Enter Verification Code
                            </label>
                            <input
                                type="text"
                                maxLength="6"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                className="w-full text-center tracking-[1em] text-2xl font-bold py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-rose-100 focus:border-rose-500 outline-none transition-all"
                                placeholder="000000"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                <FaExclamationCircle />
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                <FaCheckCircle />
                                <span>{success}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-rose-500 to-pink-500 text-white py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-rose-200 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? "Verifying..." : "Verify Account"}
                        </button>

                        <div className="text-center pt-4">
                            <p className="text-sm text-gray-500">
                                Didn't get a code?{" "}
                                <button
                                    type="button"
                                    onClick={() => navigate("/signup")}
                                    className="text-rose-600 font-bold hover:underline"
                                >
                                    Resend
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;

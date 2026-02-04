import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle, FaHome, FaCalendarCheck } from "react-icons/fa";

const BookingSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const confirmPayment = async () => {
            if (!sessionId) return;
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`/api/bookings/check-status/${sessionId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.status === "paid") {
                    setBooking(res.data.booking);
                }
            } catch (err) {
                console.error("Payment confirmation failed", err);
            } finally {
                setLoading(false);
            }
        };

        confirmPayment();
    }, [sessionId]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-700">Confirming your reservation...</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="bg-rose-500 p-8 text-center">
                    <FaCheckCircle className="text-white text-7xl mx-auto mb-4 animate-bounce" />
                    <h1 className="text-3xl font-bold text-white">Booking Confirmed!</h1>
                    <p className="text-rose-100 mt-2">You're all set for your trip.</p>
                </div>

                <div className="p-8">
                    {booking && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <img
                                    src={booking.listingId?.images?.[0] || "https://via.placeholder.com/100"}
                                    alt="listing"
                                    className="w-20 h-20 object-cover rounded-xl shadow-md"
                                />
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">{booking.listingId?.title}</h3>
                                    <p className="text-gray-500 text-sm">{booking.listingId?.location?.city}, {booking.listingId?.location?.country}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-y border-gray-100 py-6">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Check-in</p>
                                    <p className="font-semibold text-gray-700">{new Date(booking.checkIn).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Checkout</p>
                                    <p className="font-semibold text-gray-700">{new Date(booking.checkOut).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                                <span className="text-gray-600 font-medium">Total Paid</span>
                                <span className="text-2xl font-bold text-gray-900">${booking.totalAmount}</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3 mt-8">
                        <button
                            onClick={() => navigate("/")}
                            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                        >
                            <FaHome />
                            Return Home
                        </button>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
                    <p className="text-sm text-gray-500">We've sent a confirmation email to you.</p>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;

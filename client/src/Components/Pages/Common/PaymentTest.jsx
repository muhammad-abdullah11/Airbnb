import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

const PaymentTest = () => {
  const { id: listingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [listing, setListing] = useState(null);
  const [checkIn, setCheckIn] = useState(location.state?.checkIn || '2026-02-13');
  const [checkOut, setCheckOut] = useState(location.state?.checkOut || '2026-02-15');
  const [guests, setGuests] = useState(location.state?.guests || 1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!listingId) return;
    (async () => {
      try {
        const res = await axios.get(`/api/v1/listings/listing/${listingId}`);
        setListing(res.data.listing);
      } catch (err) {
        console.error('Failed to fetch listing', err);
      }
    })();
  }, [listingId]);

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('Redirecting to secure payment...');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You must be logged in to book.');
        setLoading(false);
        return;
      }

      // Call the leaner checkout session endpoint
      const response = await axios.post(
        '/api/bookings/create-checkout-session',
        { listingId, checkIn, checkOut, guests },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.url) {
        // Redirection to Stripe Checkout
        window.location.href = response.data.url;
      } else {
        setMessage('Failed to get payment URL');
        setLoading(false);
      }

    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || err.message || 'Error during payment');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Complete Your Booking</h2>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-lg font-medium text-gray-900 mb-1">{listing?.title || 'Loading...'}</div>
          <div className="text-sm text-gray-600">Price per night: <span className="font-semibold text-gray-900">${listing?.pricePerNight || '...'}</span></div>
          <div className="text-sm text-gray-600">Cleaning fee: <span className="font-semibold text-gray-900">${listing?.cleaningFee || 0}</span></div>
        </div>

        <form onSubmit={handlePay} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Check-out</label>
              <input
                type="date"
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Number of Guests</label>
            <input
              type="number"
              value={guests}
              onChange={e => setGuests(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              min={1}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all 
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700 shadow-md transform active:scale-95'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Proceed to Payment'}
          </button>
        </form>

        {message && (
          <div className={`mt-6 p-3 rounded-lg text-sm text-center ${message.includes('Error') || message.includes('Failed') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentTest;

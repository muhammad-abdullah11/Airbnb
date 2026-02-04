import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../Contexts/userContext.jsx';
import { FaStar, FaHeart, FaRegHeart, FaShare, FaWifi, FaSnowflake, FaUtensils, FaTv, FaParking, FaSwimmingPool, FaDumbbell, FaShieldAlt, FaKey, FaMedal, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { useParams, useNavigate } from 'react-router-dom';

const Listing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  // Unavailable periods fetched from server and computed merged periods
  const [unavailablePeriods, setUnavailablePeriods] = useState([]);
  const [isRangeUnavailable, setIsRangeUnavailable] = useState(false);
  const [conflictingPeriod, setConflictingPeriod] = useState(null);

  // Reviews
  const [reviews, setReviews] = useState([]);
  const { user } = useContext(AuthContext);

  // Placeholder images
  const placeholderImages = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop'
  ];

  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`/api/v1/listings/listing/${id}`);
        setListing(res.data.listing);

        // also fetch unavailable periods for this listing
        try {
          const ua = await axios.get(`/api/v1/listings/listing/${id}/unavailable`);
          setUnavailablePeriods(ua.data.periods || []);
        } catch (e) {
          console.warn('Could not fetch unavailable periods', e.message || e);
          setUnavailablePeriods([]);
        }

        // fetch reviews
        try {
          const rr = await axios.get(`/api/v1/reviews/listing/${id}`);
          setReviews(rr.data.reviews || []);
        } catch (e) {
          console.warn('Could not fetch reviews', e.message || e);
          setReviews([]);
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const calculateNights = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  };

  const calculateTotal = () => {
    if (!listing) return 0;
    const nights = calculateNights();
    return (listing.pricePerNight * nights) + (listing.cleaningFee || 0);
  };

  // Check whether a given [start, end) overlaps any unavailable period
  const checkOverlap = (startStr, endStr) => {
    const start = new Date(startStr).getTime();
    const end = new Date(endStr).getTime();
    if (isNaN(start) || isNaN(end) || end <= start) return false;
    for (const p of unavailablePeriods) {
      const ps = new Date(p.startDate).getTime();
      const pe = new Date(p.endDate).getTime();
      if (ps < end && pe > start) {
        return { ps, pe, startDate: p.startDate, endDate: p.endDate };
      }
    }
    return false;
  };

  // Re-evaluate availability whenever dates or unavailablePeriods change
  useEffect(() => {
    const conflict = checkOverlap(checkIn, checkOut);
    if (conflict) {
      setIsRangeUnavailable(true);
      setConflictingPeriod({ startDate: new Date(conflict.startDate), endDate: new Date(conflict.endDate) });
    } else {
      setIsRangeUnavailable(false);
      setConflictingPeriod(null);
    }
  }, [checkIn, checkOut, unavailablePeriods]);

  const amenityIcons = {
    'WiFi': <FaWifi />,
    'Air Conditioning': <FaSnowflake />,
    'Kitchen': <FaUtensils />,
    'TV': <FaTv />,
    'Parking': <FaParking />,
    'Pool': <FaSwimmingPool />,
    'Gym': <FaDumbbell />,
    'Fireplace': '🔥',
    'Washer': '🧺',
    'Dryer': '🌀'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error || 'Listing not found'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const images = listing.images[0]?.startsWith('http')
    ? listing.images
    : placeholderImages;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Title and Actions */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
            {listing.title}
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center">
                <FaStar className="text-black mr-1" />
                <span className="font-semibold">4.95</span>
                <span className="text-gray-600 ml-1">(128 reviews)</span>
              </div>
              <span className="text-gray-600">·</span>
              <div className="flex items-center text-gray-900 underline">
                <MdLocationOn className="mr-1" />
                {listing.location?.city}, {listing.location?.country}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition">
                <FaShare />
                <span className="text-sm font-semibold underline">Share</span>
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
              >
                {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                <span className="text-sm font-semibold underline">Save</span>
              </button>
            </div>
          </div>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-4 gap-2 rounded-xl overflow-hidden mb-8 h-100 md:h-125">
          <div className="col-span-4 md:col-span-2 row-span-2">
            <img
              src={images[0]}
              alt="Main"
              className="w-full h-full object-cover hover:brightness-95 transition cursor-pointer"
            />
          </div>
          <div className="col-span-2 md:col-span-1 hidden md:block">
            <img
              src={images[1]}
              alt="Image 2"
              className="w-full h-full object-cover hover:brightness-95 transition cursor-pointer"
            />
          </div>
          <div className="col-span-2 md:col-span-1 hidden md:block">
            <img
              src={images[2]}
              alt="Image 3"
              className="w-full h-full object-cover hover:brightness-95 transition cursor-pointer"
            />
          </div>
          <div className="col-span-2 md:col-span-1 hidden md:block">
            <img
              src={images[3]}
              alt="Image 4"
              className="w-full h-full object-cover hover:brightness-95 transition cursor-pointer"
            />
          </div>
          <div className="col-span-2 md:col-span-1 hidden md:block relative">
            <img
              src={images[4]}
              alt="Image 5"
              className="w-full h-full object-cover hover:brightness-95 transition cursor-pointer"
            />
            <button className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg font-semibold text-sm border border-gray-900 hover:bg-gray-100">
              Show all photos
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            {/* Host Info */}
            <div className="pb-8 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-2">
                Entire place hosted by John
              </h2>
              <p className="text-gray-600">
                {listing.maxGuests} guests · {listing.bedrooms} bedroom{listing.bedrooms > 1 ? 's' : ''} · {listing.bedrooms} bed{listing.bedrooms > 1 ? 's' : ''} · {listing.bathrooms} bathroom{listing.bathrooms > 1 ? 's' : ''}
              </p>
            </div>

            {/* Features */}
            <div className="py-8 border-b border-gray-200 space-y-6">
              <div className="flex items-start gap-4">
                <FaKey className="text-2xl mt-1" />
                <div>
                  <h3 className="font-semibold">Self check-in</h3>
                  <p className="text-gray-600 text-sm">Check yourself in with the keypad.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FaMedal className="text-2xl mt-1" />
                <div>
                  <h3 className="font-semibold">John is a Superhost</h3>
                  <p className="text-gray-600 text-sm">Superhosts are experienced, highly rated hosts.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FaShieldAlt className="text-2xl mt-1" />
                <div>
                  <h3 className="font-semibold">Free cancellation before Feb 8</h3>
                  <p className="text-gray-600 text-sm">Get a full refund if you change your mind.</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="py-8 border-b border-gray-200">
              <p className="text-gray-700 leading-relaxed">
                {listing.description}
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                This beautiful apartment is located in the heart of {listing.location?.city}.
                Perfect for travelers looking to explore the city while enjoying modern comforts.
                The space features high ceilings, large windows with natural light, and stylish furnishings throughout.
              </p>
              <button className="mt-4 font-semibold underline">Show more</button>
            </div>

            {/* Amenities */}
            <div className="py-8 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-6">What this place offers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listing.amenities.slice(0, showAllAmenities ? listing.amenities.length : 6).map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 text-gray-900">
                    <span className="text-xl">
                      {amenityIcons[amenity] || '✓'}
                    </span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
              {listing.amenities.length > 6 && (
                <button
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                  className="mt-6 px-6 py-3 border border-gray-900 rounded-lg font-semibold hover:bg-gray-50"
                >
                  {showAllAmenities ? 'Show less' : `Show all ${listing.amenities.length} amenities`}
                </button>
              )}
            </div>

            {/* House Rules */}
            <div className="py-8">
              <h2 className="text-xl font-semibold mb-4">House rules</h2>
              <div className="space-y-3">
                <p className="text-gray-700">Check-in after 3:00 PM</p>
                <p className="text-gray-700">Checkout before 11:00 AM</p>
                <p className="text-gray-700">Maximum {listing.maxGuests} guests</p>
                {listing.houseRules.map((rule, index) => (
                  <p key={index} className="text-gray-700">{rule}</p>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="py-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Guest reviews</h2>

              {/* Add review form */}
              {user ? (
                <div className="mb-6 p-4 border rounded">
                  <div className="mb-2 font-semibold">Leave a review</div>
                  <div className="grid grid-cols-1 gap-2">
                    <select id="review-rating" defaultValue="5" className="p-2 border rounded w-32" onChange={(e) => { /* no-op, controlled below */ }}>
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Very good</option>
                      <option value="3">3 - Good</option>
                      <option value="2">2 - Fair</option>
                      <option value="1">1 - Poor</option>
                    </select>
                    <textarea id="review-comment" placeholder="Write your review" className="p-2 border rounded" rows={3}></textarea>
                    <div>
                      <button onClick={async () => {
                        const rating = Number(document.getElementById('review-rating').value);
                        const comment = document.getElementById('review-comment').value.trim();
                        if (!comment) return alert('Please write a comment');
                        try {
                          const resp = await axios.post('/api/v1/reviews/create', { itemType: 'listing', itemId: listing._id, rating, comment }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
                          setReviews(prev => [resp.data.review, ...prev]);
                          document.getElementById('review-comment').value = '';
                          alert('Review added');
                        } catch (e) {
                          alert(e.response?.data?.message || 'Could not submit review');
                        }
                      }} className="px-4 py-2 bg-green-600 text-white rounded">Post review</button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 mb-6">Log in to leave a review</p>
              )}

              {reviews.length === 0 ? (
                <p className="text-gray-600">No reviews yet</p>
              ) : (
                <div className="space-y-6">
                  {reviews.map((r) => (
                    <div key={r._id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {r.userId?.avatar ? (
                            <img src={r.userId.avatar} className="w-10 h-10 rounded-full" alt={r.userId.name} />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">{r.userId?.name?.[0]}</div>
                          )}
                          <div>
                            <div className="font-semibold">{r.userId?.name || 'Guest'}</div>
                            <div className="text-xs text-gray-600">{r.userId?.email}</div>
                          </div>
                        </div>
                        <div className="text-sm font-semibold">{r.rating} / 5</div>
                      </div>
                      <div className="text-gray-700">{r.comment}</div>

                      <div className="mt-2 text-right">
                        {(user && (user._id === r.userId?._id || user._id === (listing.hostId?._id || listing.hostId))) && (
                          <button onClick={async () => {
                            try {
                              const token = localStorage.getItem('token');
                              if (!token) return alert('Please login to delete reviews');
                              await axios.delete(`/api/v1/reviews/${r._id}`, { headers: { Authorization: `Bearer ${token}` } });
                              setReviews(prev => prev.filter(x => x._id !== r._id));
                            } catch (e) {
                              if (e.response?.status === 401) {
                                alert('Session expired or unauthorized. Please log in again.');
                                return;
                              }
                              alert(e.response?.data?.message || 'Delete failed');
                            }
                          }} className="text-sm text-red-600 underline">Delete</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="border border-gray-300 rounded-xl shadow-xl p-6 sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-semibold">${listing.pricePerNight}</span>
                  <span className="text-gray-600">/ night</span>
                </div>
                <div className="flex items-center gap-2 text-sm mt-1">
                  <FaStar className="text-black" />
                  <span className="font-semibold">4.95</span>
                  <span className="text-gray-600">· 128 reviews</span>
                </div>
              </div>

              {/* Date Selection */}
              {!isRangeUnavailable && (
                <div className="border border-gray-400 rounded-lg mb-4 grid grid-cols-2">
                  <div className="p-3 border-r border-gray-400">
                    <div className="text-xs font-semibold uppercase">Check-in</div>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="text-sm mt-1 w-full outline-none"
                    />
                  </div>
                  <div className="p-3">
                    <div className="text-xs font-semibold uppercase">Checkout</div>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="text-sm mt-1 w-full outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Guests */}
              {!isRangeUnavailable && (
                <div className="border border-gray-400 rounded-lg p-3 mb-4">
                  <div className="text-xs font-semibold uppercase">Guests</div>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="text-sm mt-1 w-full outline-none"
                  >
                    {[...Array(listing.maxGuests)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} guest{i + 1 > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Reserve/Unavailable Button */}
              {isRangeUnavailable ? (
                <div className="space-y-3 mb-4">
                  <div className="w-full bg-gray-100 text-center py-4 rounded-lg font-semibold text-gray-700">
                    {conflictingPeriod ? (
                      <div>
                        <p className="text-sm mb-1">Already booked until</p>
                        <p className="text-lg text-rose-600">{conflictingPeriod.endDate.toLocaleDateString()}</p>
                      </div>
                    ) : (
                      <span>Unavailable for these dates</span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setCheckIn('');
                      setCheckOut('');
                    }}
                    className="w-full py-2 text-sm font-semibold underline text-gray-900 hover:text-gray-600 transition"
                  >
                    Select different dates
                  </button>
                </div>
              ) : (
                <button
                  className="w-full bg-linear-to-r from-red-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all mb-4"
                  onClick={() => {
                    const token = localStorage.getItem('token');
                    if (!token) {
                      navigate('/login');
                      return;
                    }
                    navigate(`/listing/${id}/pay`, { state: { checkIn, checkOut, guests } });
                  }}
                >
                  Reserve
                </button>
              )}

              {!isRangeUnavailable && (
                <>
                  <p className="text-center text-sm text-gray-600 mb-4">
                    You won't be charged yet
                  </p>

                  {/* Price Breakdown */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="underline">${listing.pricePerNight} x {calculateNights()} nights</span>
                      <span>${listing.pricePerNight * calculateNights()}</span>
                    </div>
                    {listing.cleaningFee > 0 && (
                      <div className="flex justify-between">
                        <span className="underline">Cleaning fee</span>
                        <span>${listing.cleaningFee}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="underline">Airbnb service fee</span>
                      <span>${Math.round(listing.pricePerNight * calculateNights() * 0.14)}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-300 mt-4 pt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${calculateTotal() + Math.round(listing.pricePerNight * calculateNights() * 0.14)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listing;
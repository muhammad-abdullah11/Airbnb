import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../Contexts/userContext.jsx';
import { FaStar, FaHeart, FaRegHeart, FaShare, FaWifi, FaSnowflake, FaUtensils, FaTv, FaParking, FaSwimmingPool, FaDumbbell, FaShieldAlt, FaKey, FaMedal, FaEdit, FaTrash } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { useParams, useNavigate } from 'react-router-dom';

const HostViewListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState([]);
  const { user } = useContext(AuthContext);
  const [reviewDeleting, setReviewDeleting] = useState(false);

  // Placeholder images
  const placeholderImages = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h-600&fit=crop',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop'
  ];

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

  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`/api/v1/listings/listing/${id}`);
        setListing(res.data.listing);

        // fetch reviews for this listing
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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`/api/v1/listings/delete/${id}`);
      alert('Listing deleted successfully');
      navigate('/host-home'); // Redirect to host listings page
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete listing');
    } finally {
      setDeleting(false);
      setDeleteConfirm(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading listing...</p>
      </div>
    </div>
  );

  if (error || !listing) return (
    <div className="min-h-screen flex items-center justify-center">
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

  const images = listing.images[0]?.startsWith('http') ? listing.images : placeholderImages;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Title and Actions */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            {listing.title}
          </h1>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate(`/edit-listing/${id}`)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <FaEdit /> Edit
            </button>
            <button 
              onClick={() => setDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <FaTrash /> Delete
            </button>
          </div>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-4 gap-2 rounded-xl overflow-hidden mb-8 h-100 md:h-125">
          <div className="col-span-4 md:col-span-2 row-span-2">
            <img src={images[0]} alt="Main" className="w-full h-full object-cover hover:brightness-95 transition cursor-pointer"/>
          </div>
          {images.slice(1).map((img, idx) => (
            <div key={idx} className="col-span-2 md:col-span-1 hidden md:block relative">
              <img src={img} alt={`Image ${idx+2}`} className="w-full h-full object-cover hover:brightness-95 transition cursor-pointer"/>
              {idx === 3 && (
                <button className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg font-semibold text-sm border border-gray-900 hover:bg-gray-100">
                  Show all photos
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host & Property Info */}
            <div className="pb-8 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-2">Entire place hosted by {listing.hostName || 'Host'}</h2>
              <p className="text-gray-600">{listing.maxGuests} guests · {listing.bedrooms} bedroom{listing.bedrooms>1?'s':''} · {listing.beds} bed{listing.beds>1?'s':''} · {listing.bathrooms} bathroom{listing.bathrooms>1?'s':''}</p>
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
                  <h3 className="font-semibold">{listing.hostName} is a Superhost</h3>
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
              <p className="text-gray-700 leading-relaxed">{listing.description}</p>
              <button className="mt-4 font-semibold underline">Show more</button>
            </div>

            {/* Amenities */}
            <div className="py-8 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-6">What this place offers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listing.amenities.slice(0, showAllAmenities ? listing.amenities.length : 6).map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 text-gray-900">
                    <span className="text-xl">{amenityIcons[amenity] || '✓'}</span>
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
                {listing.houseRules.map((rule, idx) => (
                  <p key={idx} className="text-gray-700">{rule}</p>
                ))}
              </div>
            </div>

            {/* Reviews (host view) */}
            <div className="py-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Guest reviews</h2>

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
                          <button disabled={reviewDeleting} onClick={async () => {
                            if (!confirm('Delete this review?')) return;
                            try {
                              const token = localStorage.getItem('token');
                              if (!token) return alert('Please login to delete reviews');
                              setReviewDeleting(true);
                              await axios.delete(`/api/v1/reviews/${r._id}`, { headers: { Authorization: `Bearer ${token}` } });
                              setReviews(prev => prev.filter(x => x._id !== r._id));
                            } catch (e) {
                              if (e.response?.status === 401) {
                                alert('Session expired or unauthorized. Please log in again.');
                                return;
                              }
                              alert(e.response?.data?.message || 'Delete failed');
                            } finally { setReviewDeleting(false); }
                          }} className="text-sm text-red-600 underline">Delete</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl max-w-sm w-full text-center space-y-4">
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
              <p>Are you sure you want to delete this listing? This action cannot be undone.</p>
              <div className="flex justify-center gap-4 mt-4">
                <button 
                  onClick={() => setDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  className={`px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition ${deleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default HostViewListing;

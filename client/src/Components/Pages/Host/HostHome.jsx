import React, { useState, useEffect ,useContext} from 'react';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { AuthContext } from "../../Contexts/userContext";

const HostHome = () => {

  const { user} = useContext(AuthContext); // FIXED: no parentheses

  useEffect(()=>{
    if(user?.role!=="host"){
      window.location.href="/"
    }
  },[user])

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  // Placeholder images
  const placeholderImages = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=500&h=400&fit=crop',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=500&h=400&fit=crop'
  ];

  // Fetch listings
  useEffect(() => {
    fetch('/api/v1/listings/user-listings')
      .then(res => res.json())
      .then(data => {
        setListings(data.listings || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Toggle favorite
  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fav => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing places...</p>
        </div>
      </div>
    );
  }

  // No listings
  if (listings.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600 text-lg">No listings available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      <button
      onClick={()=>window.location.href="/create-listing"}
  className="
    text-lg m-7 px-3 py-2 font-medium text-gray-700
    bg-white hover:bg-gray-100 rounded-lg
    shadow-lg border hover:shadow-md
    transition-all duration-200
    cursor-pointer
  "
>
    Create Listing
</button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          My Listings →
        </h2>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {listings.map((listing, index) => (
            <div 
              key={listing._id}
              onClick={() => window.location.href = `/-listing/${listing._id}`}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div className="relative overflow-hidden rounded-xl mb-3 aspect-square">
                <img
              onClick={() => window.location.href = `/-listing/${listing._id}`}
                  src={listing.images[0]?.startsWith('http') 
                    ? listing.images[0] 
                    : placeholderImages[index % placeholderImages.length]}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(listing._id);
                  }}
                  className="absolute top-3 right-3 p-2 hover:scale-110 transition-transform"
                >
                  {favorites.includes(listing._id) ? (
                    <FaHeart className="text-red-500 text-xl drop-shadow-lg" />
                  ) : (
                    <FaRegHeart className="text-white text-xl drop-shadow-lg" />
                  )}
                </button>

                {/* Badge */}
                <div className="absolute top-3 left-3 bg-white rounded-full px-3 py-1 text-xs font-medium shadow-md">
                  Guest favorite
                </div>
              </div>

              {/* Info */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {listing.title}
                  </h3>
                  <div className="flex items-center space-x-1 text-sm">
                    <FaStar className="text-black text-xs" />
                    <span className="font-medium">
                      {(4.5 + Math.random() * 0.5).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm truncate">
                  {listing.location?.city}, {listing.location?.country}
                </p>
                
                <p className="text-gray-600 text-sm">
                  {listing.bedrooms} bedroom{listing.bedrooms > 1 ? 's' : ''} · {listing.bathrooms} bathroom{listing.bathrooms > 1 ? 's' : ''}
                </p>
                
                <div className="pt-1">
                  <span className="font-semibold text-gray-900">${listing.pricePerNight}</span>
                  <span className="text-gray-600 text-sm"> for 1 nights</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            Showing {listings.length} amazing {listings.length === 1 ? 'place' : 'places'} to stay
          </p>
          <button className="mt-4 px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">
            Show more properties
          </button>
        </div>
      </div>
    </div>
  );
};

export default HostHome;
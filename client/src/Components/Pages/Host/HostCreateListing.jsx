import React, { useState } from "react";
import axios from "axios";
import { FaWifi, FaSnowflake, FaUtensils, FaTv, FaParking, FaSwimmingPool, FaDumbbell } from "react-icons/fa";
import { MdHouse, MdOutlineDescription, MdAttachMoney, MdLocationOn } from "react-icons/md";

const amenitiesOptions = [
  { label: "WiFi", icon: <FaWifi /> },
  { label: "Air Conditioning", icon: <FaSnowflake /> },
  { label: "Kitchen", icon: <FaUtensils /> },
  { label: "TV", icon: <FaTv /> },
  { label: "Parking", icon: <FaParking /> },
  { label: "Pool", icon: <FaSwimmingPool /> },
  { label: "Gym", icon: <FaDumbbell /> }
];

const HostCreateListing = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pricePerNight: "",
    cleaningFee: "",
    address: "",
    city: "",
    country: "",
    lat: "",
    lng: "",
    amenities: [],
    houseRules: "",
    maxGuests: 1,
    bedrooms: 1,
    bathrooms: 1
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: newAmenities };
    });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter(file => file.type.startsWith('image/'));

    if (files.length !== validImages.length) {
      setError("Only image files are supported.");
      return;
    }

    if (validImages.length > 5) {
      setError("You can only upload a maximum of 5 images.");
      setImages(validImages.slice(0, 5));
    } else {
      setError("");
      setImages(validImages);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("pricePerNight", formData.pricePerNight);
      data.append("cleaningFee", formData.cleaningFee || 0);
      data.append("address", formData.address);
      data.append("location[city]", formData.city);
      data.append("location[country]", formData.country);
      data.append("location[lat]", formData.lat || 0);
      data.append("location[lng]", formData.lng || 0);
      data.append("maxGuests", formData.maxGuests);
      data.append("bedrooms", formData.bedrooms);
      data.append("bathrooms", formData.bathrooms);
      data.append("houseRules", formData.houseRules);

      formData.amenities.forEach(a => data.append("amenities[]", a));
      images.forEach(file => data.append("images", file));

      await axios.post("/api/v1/listings/create", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setSuccess("Listing created successfully!");
      setFormData({
        title: "",
        description: "",
        pricePerNight: "",
        cleaningFee: "",
        address: "",
        city: "",
        country: "",
        lat: "",
        lng: "",
        amenities: [],
        houseRules: "",
        maxGuests: 1,
        bedrooms: 1,
        bathrooms: 1
      });
      setImages([]);
      setTimeout(() => {
        window.location.href = "/host-home"
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Create a New Listing</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Title & Description */}
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Basic Info</h2>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 font-medium text-gray-700 mb-1">
                <MdHouse /> Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 font-medium text-gray-700 mb-1">
                <MdOutlineDescription /> Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Pricing</h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="flex items-center gap-2 font-medium text-gray-700 mb-1">
                <MdAttachMoney /> Price per Night
              </label>
              <input
                type="number"
                name="pricePerNight"
                value={formData.pricePerNight}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="font-medium text-gray-700 mb-1">Cleaning Fee</label>
              <input
                type="number"
                name="cleaningFee"
                value={formData.cleaningFee}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="flex items-center gap-2 font-medium text-gray-700 mb-1">
                <MdLocationOn /> Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
              required
            />
            <input
              type="number"
              name="lat"
              placeholder="Latitude"
              value={formData.lat}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
            />
            <input
              type="number"
              name="lng"
              placeholder="Longitude"
              value={formData.lng}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>
        </div>

        {/* Guests & Rooms */}
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Guests & Rooms</h2>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <input
              type="number"
              name="maxGuests"
              placeholder="Max Guests"
              min="1"
              value={formData.maxGuests}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
            />
            <input
              type="number"
              name="bedrooms"
              placeholder="Bedrooms"
              min="1"
              value={formData.bedrooms}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
            />
            <input
              type="number"
              name="bathrooms"
              placeholder="Bathrooms"
              min="1"
              value={formData.bathrooms}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
            {amenitiesOptions.map((a) => (
              <label key={a.label} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(a.label)}
                  onChange={() => handleAmenityChange(a.label)}
                />
                <span className="text-lg">{a.icon}</span>
                <span>{a.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* House Rules */}
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">House Rules</h2>
          <textarea
            name="houseRules"
            value={formData.houseRules}
            onChange={handleChange}
            rows="4"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>

        {/* Images */}
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <h2 className="text-2xl font-semibold border-b pb-2">Images</h2>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImages}
            className="mt-2"
          />
          <div className="grid grid-cols-3 gap-2 mt-4">
            {images.map((file, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-full h-32 object-cover rounded-lg border"
              />
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition"
        >
          {loading ? "Creating..." : "Create Listing"}
        </button>

      </form>
    </div>
  );
};

export default HostCreateListing;

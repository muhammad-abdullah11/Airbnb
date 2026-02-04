import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const amenitiesOptions = [
  "WiFi",
  "Air Conditioning",
  "Kitchen",
  "TV",
  "Parking",
  "Pool",
  "Gym",
  "Fireplace",
  "Washer",
  "Dryer",
];

const HostEditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pricePerNight: 0,
    maxGuests: 1,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: [],
    houseRules: [],
    images: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);

  // Fetch listing
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/v1/listings/listing/${id}`);
        const data = res.data.listing;

        setFormData({
          title: data.title || "",
          description: data.description || "",
          pricePerNight: data.pricePerNight || 0,
          maxGuests: data.maxGuests || 1,
          bedrooms: data.bedrooms || 1,
          beds: data.beds || 1,
          bathrooms: data.bathrooms || 1,
          amenities: data.amenities || [],
          houseRules: data.houseRules || [],
          images: data.images || [],
        });

        setImagePreviews(data.images || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // Handle amenities toggle
  const handleAmenityChange = (amenity) => {
    setFormData((prev) => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: newAmenities };
    });
  };

  // House rules handlers
  const handleHouseRuleChange = (index, value) => {
    const newRules = [...formData.houseRules];
    newRules[index] = value;
    setFormData((prev) => ({ ...prev, houseRules: newRules }));
  };

  const addHouseRule = () =>
    setFormData((prev) => ({ ...prev, houseRules: [...prev.houseRules, ""] }));
  const removeHouseRule = (index) => {
    const newRules = [...formData.houseRules];
    newRules.splice(index, 1);
    setFormData((prev) => ({ ...prev, houseRules: newRules }));
  };

  // Handle image uploads
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));

    // Show previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);
  setError("");
  setSuccess("");

  try {
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        // Append only File objects (new uploads)
        formData.images.forEach((file) => {
          if (file instanceof File) {
            data.append("images", file);
          }
        });
      } else if (Array.isArray(formData[key])) {
        // For arrays (amenities, houseRules)
        formData[key].forEach((item) => data.append(key, item));
      } else {
        // Primitive fields
        data.append(key, formData[key]);
      }
    });

    await axios.put(`/api/v1/listings/update/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setSuccess("Listing updated successfully!");
    setTimeout(() => navigate(`/host-home`), 1500);
  } catch (err) {
    setError(err.response?.data?.message || "Failed to update listing");
  } finally {
    setSaving(false);
  }
};


  if (loading) return <p className="text-center py-10">Loading listing data...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Listing</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Description */}
        <div>
          <label className="block text-sm font-semibold mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        {/* Price & Guests */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Price per Night</label>
            <input
              type="number"
              name="pricePerNight"
              value={formData.pricePerNight}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Max Guests</label>
            <input
              type="number"
              name="maxGuests"
              value={formData.maxGuests}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              min={1}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              min={1}
              required
            />
          </div>
        </div>

        {/* Beds & Bathrooms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Beds</label>
            <input
              type="number"
              name="beds"
              value={formData.beds}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              min={1}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              min={1}
              required
            />
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-semibold mb-2">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {amenitiesOptions.map((amenity, idx) => (
              <label
                key={idx}
                className={`px-3 py-1 border rounded-full cursor-pointer ${
                  formData.amenities.includes(amenity)
                    ? "bg-red-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                />
                {amenity}
              </label>
            ))}
          </div>
        </div>

        {/* House Rules */}
        <div>
          <label className="block text-sm font-semibold mb-2">House Rules</label>
          <div className="space-y-2">
            {formData.houseRules.map((rule, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={rule}
                  onChange={(e) => handleHouseRuleChange(idx, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg p-2"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeHouseRule(idx)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addHouseRule}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 mt-2"
            >
              Add Rule
            </button>
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-semibold mb-2">Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="mb-3"
          />
          <div className="flex flex-wrap gap-3">
            {imagePreviews.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`preview-${idx}`}
                className="w-24 h-24 object-cover rounded-lg border border-gray-300"
              />
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`w-full py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition ${
            saving ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={saving}
        >
          {saving ? "Saving..." : "Update Listing"}
        </button>
      </form>
    </div>
  );
};

export default HostEditListing;

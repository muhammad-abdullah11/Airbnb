const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "listings", // folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "avif", "webp", "gif", "svg", "heic", "heif", "tiff", "bmp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }], // optional resizing
  },
});

const upload = multer({ storage });

module.exports = {
  cloudinary,
  upload,
};

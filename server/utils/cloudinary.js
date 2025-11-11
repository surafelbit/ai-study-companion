require("dotenv").config(); // <-- Add this line FIRST

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary,
  params: async function name(req, file) {
    const isPdf = file.mimetype == "application/pdf";
    return {
      folder: "uploads",
      resource_type: isPdf ? "raw" : "image",
      allowed_formats: ["pdf", "jpeg", "png", "jpg"],
    };
  },
  // {
  //   folder: "uploads",
  //   allowed_formats: ["pdf", "jpeg", "png", "jpg"],
  // },
});
module.exports = {
  cloudinary,
  storage,
};

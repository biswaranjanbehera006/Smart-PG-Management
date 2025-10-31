import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// 📤 Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "smart_pg_images", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 800, height: 600, crop: "limit" }],
  },
});

// Initialize multer with Cloudinary storage
const upload = multer({ storage });

export default upload;

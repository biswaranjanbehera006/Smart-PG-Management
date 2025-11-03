import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  updateProfilePhoto,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* ============================
   🧭 AUTH ROUTES (User System)
   Base URL: /api/auth
   ============================ */

// 📝 Register new user (tenant / owner / admin)
router.post("/register", register);

// 🔐 Login (tenant, owner, or admin)
router.post("/login", login);

// 👤 Get logged-in user's profile
router.get("/profile", protect, getProfile);

// ✏️ Update profile (name, phone, password, or profilePic via frontend)
router.put("/profile", protect, updateProfile);

// 📸 Upload or Update Profile Photo (handled by multer + Cloudinary)
router.put(
  "/profile/photo",
  protect,
  upload.single("photo"), // "photo" must match your frontend FormData key
  updateProfilePhoto
);

// 🔁 Forgot Password (send OTP to user’s email)
router.post("/forgot-password", forgotPassword);

// ✅ Reset Password using verified OTP
router.post("/reset-password", resetPassword);

export default router;

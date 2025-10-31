import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Register new user or owner
router.post("/register", register);

// 🔹 Login (tenant, owner, or admin)
router.post("/login", login);

// 🔹 Get logged-in user profile
router.get("/profile", protect, getProfile);

// 🔹 Update user profile
router.put("/profile", protect, updateProfile);

// 🔹 Forgot password (send OTP to email)
router.post("/forgot-password", forgotPassword);

// 🔹 Reset password using OTP
router.post("/reset-password", resetPassword);

export default router;

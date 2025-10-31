import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  toggleBlockUser,
  deleteUser,
  deletePG,
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 👑 Admin Protected Routes
router.get("/dashboard", protect, admin, getDashboardStats); // 📊 Summary stats
router.get("/users", protect, admin, getAllUsers);           // 👥 View all users
router.put("/users/:id/block", protect, admin, toggleBlockUser); // 🚫 Block / Unblock
router.delete("/users/:id", protect, admin, deleteUser);      // ❌ Delete user
router.delete("/pg/:id", protect, admin, deletePG);           // 🏠 Delete PG

export default router;

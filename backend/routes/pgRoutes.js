import express from "express";
import {
  getPGs,
  getPGById,
  createPG,
  updatePG,
  deletePG,
} from "../controllers/pgController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js"; // 🧩 Multer middleware for file uploads

const router = express.Router();

/**
 * 🏠 Public Routes (Accessible to all users)
 */
router.get("/", getPGs); // Get all PGs
router.get("/:id", getPGById); // Get single PG by ID

/**
 * 👤 Protected Routes (For PG Owners/Admins)
 * - Uses Multer to handle 'images' field from form-data (max 5 files)
 */
router.post("/", protect, upload.array("images", 5), createPG); // Create PG
router.put("/:id", protect, upload.array("images", 5), updatePG); // Update PG
router.delete("/:id", protect, deletePG); // Delete PG

export default router;

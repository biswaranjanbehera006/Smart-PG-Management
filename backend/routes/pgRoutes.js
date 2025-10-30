import express from "express";
const router = express.Router();
import { getPGs, getPGById, createPG, updatePG, deletePG } from "../controllers/pgController.js";
import { protect } from "../middleware/authMiddleware.js";

router.get("/", getPGs);
router.get("/:id", getPGById);
router.post("/", protect, createPG);
router.put("/:id", protect, updatePG);
router.delete("/:id", protect, deletePG);

export default router;

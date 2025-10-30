import express from "express";
const router = express.Router();
import { createBooking, getMyBookings, getAllBookings, cancelBooking } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/all", protect, getAllBookings);
router.put("/:id/cancel", protect, cancelBooking);

export default router;

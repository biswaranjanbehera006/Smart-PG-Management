import express from "express";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
   downloadInvoice,
   getBookingsByOwner,
} from "../controllers/bookingController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===========================
   🧾 Booking Routes
   Base URL: /api/bookings
   =========================== */

// 📌 @route   POST /api/bookings
// 👤 @access  Private (Tenant)
// 📝 Create a new booking
router.post("/", protect, createBooking);

// 📌 @route   GET /api/bookings/my
// 👤 @access  Private (Tenant)
// 📝 Get all bookings for the logged-in user
router.get("/my", protect, getMyBookings);

// 📌 @route   GET /api/bookings/all
// 👤 @access  Private (Admin Only)
// 📝 Get all bookings in the system
router.get("/all", protect, admin, getAllBookings);

// 📌 @route   PUT /api/bookings/:id/cancel
// 👤 @access  Private (Tenant/Admin)
// 📝 Cancel an existing booking
router.put("/:id/cancel", protect, cancelBooking);

// 📌 @route   GET /api/bookings/owner
// 👤 @access  Private (Owner)
// 📝 Get all bookings for PGs owned by logged-in owner
router.get("/owner", protect, getBookingsByOwner);



// 🧾 New route for downloading invoice
router.get("/:id/invoice", protect, downloadInvoice);

export default router;

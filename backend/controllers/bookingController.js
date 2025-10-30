import Booking from "../models/Booking.js";
import PG from "../models/PG.js";
import shortid from "shortid";

// 🧾 Create new booking
export const createBooking = async (req, res) => {
  try {
    const { pgId, checkIn, checkOut, totalAmount } = req.body;

    const pg = await PG.findById(pgId);
    if (!pg) return res.status(404).json({ message: "PG not found" });
    if (pg.availableRooms <= 0)
      return res.status(400).json({ message: "No rooms available" });

    const booking = await Booking.create({
      userId: req.user._id,
      pgId,
      checkIn,
      checkOut,
      totalAmount,
      bookingRef: `PG-${shortid.generate()}`,
    });

    pg.availableRooms -= 1;
    await pg.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📜 Get user’s bookings
export const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id }).populate("pgId");
  res.json(bookings);
};

// 📋 Get all bookings (admin)
export const getAllBookings = async (req, res) => {
  const bookings = await Booking.find()
    .populate("pgId")
    .populate("userId", "name email");
  res.json(bookings);
};

// ❌ Cancel booking
export const cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  if (
    booking.userId.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  booking.bookingStatus = "cancelled";
  await booking.save();

  const pg = await PG.findById(booking.pgId);
  if (pg) {
    pg.availableRooms += 1;
    await pg.save();
  }

  res.json({ message: "Booking cancelled", booking });
};

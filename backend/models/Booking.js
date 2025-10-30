import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  pgId: { type: mongoose.Schema.Types.ObjectId, ref: "PG", required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  bookingStatus: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  bookingRef: { type: String, unique: true },
  invoiceUrl: { type: String }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);

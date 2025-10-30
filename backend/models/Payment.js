import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: { type: Number, required: true },
  gateway: { type: String, enum: ["Razorpay", "Stripe"], default: "Razorpay" },
  transactionId: { type: String },
  status: { type: String, enum: ["success", "failed", "pending"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);

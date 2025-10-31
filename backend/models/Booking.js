import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // 🔗 Reference to the user (tenant who books)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔗 Reference to the PG being booked
    pgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PG",
      required: true,
    },

    // 🧍 Tenant details (collected at booking time)
    tenantName: {
      type: String,
      required: true,
      trim: true,
    },
    tenantContact: {
      type: String,
      required: true,
      trim: true,
    },

    // 📅 Booking period
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },

    // 💰 Payment details
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },

    // 🏷️ Booking details
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    bookingRef: {
      type: String,
      unique: true,
    },

    // 📄 Invoice link (optional, can store uploaded PDF URL later)
    invoiceUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);

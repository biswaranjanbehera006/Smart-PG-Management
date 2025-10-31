// backend/models/PG.js
import mongoose from "mongoose";

/**
 * 🏠 PG Schema for Smart PG Management System
 * - Supports multiple Cloudinary image URLs
 * - Tracks PG status (active/inactive)
 * - References the owner (User)
 */

const pgSchema = new mongoose.Schema(
  {
    // 👤 Owner reference (the user who listed the PG)
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // 🏠 PG Basic Details
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },

    // 💰 Rent per month
    rent: { type: Number, required: true },

    // 🛏️ Number of available rooms
    availableRooms: { type: Number, default: 1 },

    // 🧩 Facilities list (WiFi, AC, etc.)
    facilities: [{ type: String, default: [] }],

    // 🖼️ Cloudinary image URLs (multiple supported)
    images: [
      {
        type: String, // Cloudinary URL (e.g., https://res.cloudinary.com/.../pg_image.jpg)
        required: false,
      },
    ],

    // 📊 PG status (owner/admin can toggle)
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model("PG", pgSchema);

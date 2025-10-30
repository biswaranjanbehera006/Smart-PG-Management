import mongoose from "mongoose";

const pgSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  rent: { type: Number, required: true },
  availableRooms: { type: Number, default: 1 },
  facilities: [{ type: String }],
  images: [{ type: String }],
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

export default mongoose.model("PG", pgSchema);

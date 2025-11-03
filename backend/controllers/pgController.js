import PG from "../models/PG.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

/* ======================================================
   ☁️ Configure Cloudinary
   ====================================================== */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ======================================================
   📦 Get All PGs
   ====================================================== */
/**
 * 📄 Fetch all PG listings
 * - Admin → sees all PGs (active + inactive)
 * - Other users → sees only active PGs
 * - Includes owner info
 */
export const getPGs = async (req, res) => {
  try {
    let query = { status: "active" };

    // ✅ If logged-in admin, show all PGs (not just active ones)
    if (req.user && req.user.role === "admin") {
      query = {}; // show everything
    }

    // ✅ Populate owner info (name, email, phone)
    const pgs = await PG.find(query)
      .populate("ownerId", "name email phone")
      .limit(100);

    res.json(pgs);
  } catch (error) {
    console.error("❌ Error fetching PGs:", error);
    res.status(500).json({ message: "Error fetching PGs", error: error.message });
  }
};

/* ======================================================
   🔍 Get Single PG by ID
   ====================================================== */
export const getPGById = async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id).populate("ownerId", "name email phone");
    if (!pg) return res.status(404).json({ message: "PG not found" });
    res.json(pg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   ➕ Create PG (Owner Only)
   ====================================================== */
export const createPG = async (req, res) => {
  try {
    const data = req.body;
    data.ownerId = req.user._id;

    // 📸 Upload images to Cloudinary
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "smart-pg-management",
        });
        imageUrls.push(result.secure_url);
      }
    }
    data.images = imageUrls;

    const pg = await PG.create(data);
    res.status(201).json({ message: "PG created successfully", pg });
  } catch (error) {
    console.error("❌ PG Create Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   ✏️ Update PG (Owner or Admin)
   ====================================================== */
export const updatePG = async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) return res.status(404).json({ message: "PG not found" });

    if (pg.ownerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 🖼️ If new images uploaded
    if (req.files && req.files.length > 0) {
      let imageUrls = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "smart-pg-management",
        });
        imageUrls.push(result.secure_url);
      }
      req.body.images = imageUrls;
    }

    Object.assign(pg, req.body);
    const updated = await pg.save();
    res.json({ message: "PG updated successfully", updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   ❌ Delete PG (Owner or Admin)
   ====================================================== */
export const deletePG = async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) return res.status(404).json({ message: "PG not found" });

    if (pg.ownerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await pg.deleteOne();
    res.json({ message: "PG deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

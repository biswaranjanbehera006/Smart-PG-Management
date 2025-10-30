import PG from "../models/PG.js";

// 📄 Get all PGs
export const getPGs = async (req, res) => {
  try {
    const pgs = await PG.find({ status: "active" }).limit(100);
    res.json(pgs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔍 Get PG by ID
export const getPGById = async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) return res.status(404).json({ message: "PG not found" });
    res.json(pg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ➕ Create PG (for owner)
export const createPG = async (req, res) => {
  try {
    const data = req.body;
    data.ownerId = req.user._id;
    const pg = await PG.create(data);
    res.status(201).json(pg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update PG
export const updatePG = async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) return res.status(404).json({ message: "PG not found" });

    if (pg.ownerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(pg, req.body);
    const updated = await pg.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete PG
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

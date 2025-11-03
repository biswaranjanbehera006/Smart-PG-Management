import User from "../models/User.js";
import PG from "../models/PG.js";
import Booking from "../models/Booking.js";

/* ======================================================
   📊 ADMIN DASHBOARD STATS
   ====================================================== */
export const getDashboardStats = async (req, res) => {
  try {
    const [tenants, owners, pgs, bookings] = await Promise.all([
      User.countDocuments({ role: "tenant" }),
      User.countDocuments({ role: "owner" }),
      PG.countDocuments({ status: "active" }),
      Booking.countDocuments(),
    ]);

    res.json({ tenants, owners, pgs, bookings });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      message: "Error fetching dashboard stats",
      error: error.message,
    });
  }
};

/* ======================================================
   👥 USER MANAGEMENT
   ====================================================== */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
};

export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin")
      return res.status(403).json({ message: "Cannot block admin" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
      user,
    });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({
      message: "Error blocking user",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin")
      return res.status(403).json({ message: "Cannot delete admin" });

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      message: "Error deleting user",
      error: error.message,
    });
  }
};

/* ======================================================
   🏠 PG MANAGEMENT
   ====================================================== */
export const deletePG = async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) return res.status(404).json({ message: "PG not found" });

    await pg.deleteOne();
    res.json({ message: "PG deleted successfully" });
  } catch (error) {
    console.error("Error deleting PG:", error);
    res.status(500).json({
      message: "Error deleting PG",
      error: error.message,
    });
  }
};

/* ======================================================
   📅 ALL BOOKINGS (for Admin)
   ====================================================== */
export const getAllBookingsAdmin = async (req, res) => {
  try {
    // ✅ Populate tenant, PG details, and owner details deeply
    const bookings = await Booking.find()
      .populate("userId", "name email phone") // Tenant info
      .populate({
        path: "pgId",
        select: "name city rent ownerId", // PG info
        populate: {
          path: "ownerId",
          select: "name email phone", // Owner info
        },
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res
      .status(500)
      .json({ message: "Error fetching all bookings", error: error.message });
  }
};

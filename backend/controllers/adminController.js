import User from "../models/User.js";
import PG from "../models/PG.js";
import Booking from "../models/Booking.js";

// 📊 Get overall statistics for dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const totalTenants = await User.countDocuments({ role: "tenant" });
    const totalOwners = await User.countDocuments({ role: "owner" });
    const totalPGs = await PG.countDocuments();
    const totalBookings = await Booking.countDocuments();

    res.json({
      totalTenants,
      totalOwners,
      totalPGs,
      totalBookings,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats", error });
  }
};

// 👥 Get all users (tenants + owners)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// 🚫 Block / Unblock a user
export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin")
      return res.status(403).json({ message: "Cannot block admin account" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error blocking user", error });
  }
};

// ❌ Delete a user (Tenant or Owner)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin")
      return res.status(403).json({ message: "Cannot delete admin account" });

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

// 🏠 Delete a PG listing
export const deletePG = async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) return res.status(404).json({ message: "PG not found" });

    await pg.deleteOne();
    res.json({ message: "PG deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting PG", error });
  }
};

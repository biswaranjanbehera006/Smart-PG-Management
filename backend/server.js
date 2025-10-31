// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import pgRoutes from "./routes/pgRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Import Error Middleware
import { errorHandler } from "./middleware/errorMiddleware.js";

// Load environment variables
dotenv.config();

// Connect MongoDB
console.log("🗂️ Mongo URI:", process.env.MONGODB_URI);
connectDB();

// Initialize Express App
const app = express();

// ====== Middlewares ======
app.use(cors());
app.use(express.json());

// ====== API Routes ======
app.use("/api/auth", authRoutes);        // Login, Register, Profile
app.use("/api/pg", pgRoutes);            // PG CRUD
app.use("/api/bookings", bookingRoutes); // Booking management
app.use("/api/payments", paymentRoutes); // Payment routes
app.use("/api/admin", adminRoutes);      //admin routes

// ====== Root Route ======
app.get("/", (req, res) => {
  res.send("✅ Smart PG Management API is running successfully!");
});

// ====== Error Handler ======
app.use(errorHandler);

// ====== Start Server ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

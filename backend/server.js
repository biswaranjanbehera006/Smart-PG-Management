// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Initialize dotenv
dotenv.config();

// Connect to MongoDB
console.log("Mongo URI:", process.env.MONGODB_URI);
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes (example test route)
app.get("/", (req, res) => {
  res.send("API is running successfully!");
});

// PORT setup
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🔐 Middleware to protect private routes
export const protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach full user details (excluding password)
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found. Token invalid." });
      }

      // Attach user info to request for later use
      req.user = user;

      next();
    } catch (error) {
      console.error("❌ Auth Error:", error.message);
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired, please log in again." });
      }
      return res.status(401).json({ message: "Not authorized, invalid token." });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, token missing." });
  }
};

// 🛡️ Middleware to protect admin routes
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as admin." });
  }
};

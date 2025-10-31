import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // 🧑 Basic user info
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String },

    // 🧭 Role-based access
    role: { type: String, enum: ["tenant", "owner", "admin"], default: "tenant" },

    // 🚫 Admin controls
    isBlocked: { type: Boolean, default: false },

    // 🔐 OTP for password reset (✅ Field names updated to match authController.js)
    resetPasswordOTP: { type: String },     // ⬅️ was resetOTP → renamed for controller compatibility
    resetPasswordExpire: { type: Date },    // ⬅️ was otpExpires → renamed for controller compatibility

    // 🧾 Optional email verification (for future expansion)
    isVerified: { type: Boolean, default: false },
    verificationOTP: { type: String },
    verificationExpires: { type: Date },
  },
  { timestamps: true }
);

//
// 🔒 Hash password before saving
//
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//
// 🔑 Compare entered password with hashed password
//
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);

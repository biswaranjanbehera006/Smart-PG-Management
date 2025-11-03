// src/pages/ResetPasswordPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import { toast } from "react-toastify";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ✅ Pre-fill email if user comes from ForgotPasswordPage
  const prefilledEmail = location.state?.email || "";

  const [form, setForm] = useState({
    email: prefilledEmail,
    otp: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);

  // Pre-fill email from state
  useEffect(() => {
    if (prefilledEmail) {
      setForm((prev) => ({ ...prev, email: prefilledEmail }));
    }
  }, [prefilledEmail]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, otp, newPassword } = form;

    if (!email || !otp || !newPassword) {
      return toast.error("All fields are required.");
    }

    setLoading(true);
    try {
      const { data } = await API.post("/auth/reset-password", form);
      toast.success(data.message || "Password reset successful! Please log in.");
      navigate("/login");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Invalid OTP or expired. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-100 to-white px-6 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        {/* 🧩 Title */}
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-3">
          Reset Password
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Enter your registered email, the OTP sent to you, and your new password.
        </p>

        {/* 🧾 Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* OTP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OTP Code
            </label>
            <input
              type="text"
              name="otp"
              value={form.otp}
              onChange={onChange}
              placeholder="6-digit OTP"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={onChange}
              placeholder="Enter new password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-md transition duration-300 ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* 🔙 Back to Login */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Remember your password?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

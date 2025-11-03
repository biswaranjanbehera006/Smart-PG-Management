// src/pages/ForgotPasswordPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // 🚀 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return toast.error("Please enter your registered email address.");
    }

    setLoading(true);
    try {
      const { data } = await API.post("/auth/forgot-password", { email });
      toast.success(data.message || "OTP sent successfully to your email!");

      // ✅ Navigate to reset-password page & pass email state
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to send OTP. Please check your email.";
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
          Forgot Password
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Enter your registered email below. We’ll send an OTP to help you reset
          your password.
        </p>

        {/* 🧾 Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-md transition duration-300 ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        {/* 🔙 Link to Login */}
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

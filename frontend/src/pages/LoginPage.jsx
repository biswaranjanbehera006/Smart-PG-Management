// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import { toast } from "react-toastify";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // 📝 Handle field change
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // 🚀 Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return toast.error("Please enter both email and password.");
    }

    setLoading(true);
    try {
      // ✅ Correct endpoint (your backend uses /api/auth/login)
      const { data } = await API.post("/auth/login", form);

      // 💾 Save user data in localStorage
      localStorage.setItem("user", JSON.stringify(data));

      toast.success(`Welcome back, ${data.name || "User"}!`);
      navigate("/dashboard"); // redirect after login
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Invalid credentials. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-100 to-white px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        {/* 🧩 Title */}
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-2">
          Smart PG Management
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Sign in to manage your PG or bookings
        </p>

        {/* 🧾 Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              required
              placeholder="Your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Forgot Password */}
          <div className="flex justify-between items-center">
            <Link
              to="/forgot-password"
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot password?
            </Link>
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
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-sm text-center text-gray-600">
          New here?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-medium hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

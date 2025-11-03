// src/pages/HomePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    navigate(`/pgs?city=${city}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 via-white to-slate-50">
      {/* ✅ Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-20 md:py-28">
        {/* Left content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
            Find Your Perfect <span className="text-indigo-600">PG</span> with Ease 🏠
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            Smart PG Management helps you find, book, and manage your PG stay — all in one place.  
            Whether you're a tenant or an owner, we make your journey seamless.
          </p>

          {/* ✅ Search Bar */}
          <form
            onSubmit={handleSearch}
            className="mt-6 flex items-center justify-center md:justify-start bg-white shadow-md rounded-full overflow-hidden w-full md:w-[80%] max-w-lg"
          >
            <input
              type="text"
              placeholder="Enter city name (e.g., Bhubaneswar)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-grow px-5 py-3 focus:outline-none text-gray-700"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 flex items-center gap-2 transition-all"
            >
              <Search size={20} />
              Search
            </button>
          </form>

          {/* ✅ CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <button
              onClick={() => navigate("/register")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-md shadow-sm transition-all"
            >
              Register as Tenant
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold px-6 py-3 rounded-md shadow-sm transition-all"
            >
              List Your PG
            </button>
          </div>
        </div>

        {/* ✅ Right side illustration */}
        <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
          <img
            src="https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1320"
            alt="PG illustration"
            className="w-full max-w-md md:max-w-lg drop-shadow-md"
          />
        </div>
      </section>

      {/* ✅ Why Choose Us Section */}
      <section className="py-16 bg-white border-t">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Why Choose <span className="text-indigo-600">Smart PG?</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-indigo-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-indigo-700">Verified Listings</h3>
              <p className="text-gray-600 mt-2">
                All PGs are verified to ensure a safe and comfortable stay.
              </p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-indigo-700">Smart Booking</h3>
              <p className="text-gray-600 mt-2">
                Book rooms instantly with real-time availability updates.
              </p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-indigo-700">Secure Payments</h3>
              <p className="text-gray-600 mt-2">
                Enjoy hassle-free online payments with automatic receipts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ CTA Footer */}
      <section className="py-12 bg-indigo-600 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Ready to find your next home away from home?
        </h2>
        <button
          onClick={() => navigate("/pgs")}
          className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-md hover:bg-indigo-100 transition-all"
        >
          Browse PGs
        </button>
      </section>
    </div>
  );
}

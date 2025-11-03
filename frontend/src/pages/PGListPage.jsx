// src/pages/PGListPage.jsx
import React, { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

export default function PGListPage() {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPGs();
  }, []);

  const fetchPGs = async () => {
    try {
      const { data } = await API.get("/pg");
      setPgs(data);
    } catch (err) {
      console.error("Error fetching PGs:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPGs = pgs.filter(
    (pg) =>
      pg.name?.toLowerCase().includes(search.toLowerCase()) ||
      pg.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 🔍 Search Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-slate-800">Available PGs</h1>
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          </div>
        </div>

        {/* ⏳ Loading State */}
        {loading && (
          <div className="text-center text-gray-500 text-lg">Loading PGs...</div>
        )}

        {/* 📦 Empty State */}
        {!loading && filteredPGs.length === 0 && (
          <div className="text-center text-gray-500 text-lg">
            No PGs found. Try a different search.
          </div>
        )}

        {/* 🏠 PG Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPGs.map((pg) => (
            <div
              key={pg._id}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition duration-300 border border-slate-200"
            >
              {/* 🖼️ PG Image */}
              <img
                src={
                  pg.images?.[0] ||
                  "https://images.unsplash.com/photo-1590490360182-6639e1a1e851?auto=format&fit=crop&w=800&q=80"
                }
                alt={pg.name}
                className="h-48 w-full object-cover"
              />

              {/* 📋 PG Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-1">
                  {pg.name}
                </h3>
                <p className="text-slate-600 text-sm mb-2">
                  📍 {pg.city}, {pg.address}
                </p>
                <p className="text-indigo-600 font-semibold text-lg">
                  ₹{pg.rent} / month
                </p>

                {/* 🔗 View Details */}
                <Link
                  to={`/pg/${pg._id}`}
                  className="inline-block mt-3 w-full text-center py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

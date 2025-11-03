import React, { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";
import {
  Users,
  User,
  Building2,
  Home,
  Trash2,
  Ban,
  Crown,
  CalendarDays,
  Search,
} from "lucide-react";

export default function AdminDashboard({ user }) {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [pgs, setPgs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [statsRes, usersRes, pgsRes, bookingsRes] = await Promise.all([
        API.get("/admin/dashboard", {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
        API.get("/admin/users", {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
        API.get("/pg", {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
        API.get("/admin/bookings", {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setPgs(pgsRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error("Admin load error:", err);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (id) => {
    try {
      await API.put(
        `/admin/users/${id}/block`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success("User status updated");
      loadAdminData();
    } catch {
      toast.error("Failed to update user status");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await API.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success("User deleted successfully");
      loadAdminData();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handleDeletePG = async (pgId) => {
    if (!window.confirm("Delete this PG listing?")) return;
    try {
      await API.delete(`/admin/pg/${pgId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success("PG deleted successfully");
      loadAdminData();
    } catch {
      toast.error("Failed to delete PG");
    }
  };

  // 🧠 Format date to readable yyyy-mm-dd
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toISOString().split("T")[0];
  };

  // 🔍 Filter bookings by search term
  const filteredBookings = bookings.filter((b) => {
    const tenant = b.userId?.name?.toLowerCase() || "";
    const pg = b.pgId?.name?.toLowerCase() || "";
    const owner = b.pgId?.ownerId?.name?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return tenant.includes(search) || pg.includes(search) || owner.includes(search);
  });

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading admin dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-md">
        {/* HEADER */}
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
          <Crown className="text-yellow-500" /> Admin Dashboard
        </h1>

        {/* 📊 STATS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Tenants" value={stats.tenants || 0} icon={<Users />} />
          <StatCard title="Owners" value={stats.owners || 0} icon={<User />} />
          <StatCard title="PGs" value={stats.pgs || 0} icon={<Building2 />} />
          <StatCard title="Bookings" value={stats.bookings || 0} icon={<Home />} />
        </div>

        {/* 👥 USER MANAGEMENT */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">
            Manage Users
          </h2>
          {users.length === 0 ? (
            <p className="text-gray-600">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b hover:bg-slate-50">
                      <td className="p-2">{u.name}</td>
                      <td className="p-2">{u.email}</td>
                      <td className="p-2 capitalize">{u.role}</td>
                      <td className="p-2 flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleBlock(u._id)}
                          className={`flex items-center gap-1 px-3 py-1 rounded text-white ${
                            u.isBlocked ? "bg-green-600" : "bg-yellow-600"
                          }`}
                        >
                          <Ban size={14} />
                          {u.isBlocked ? "Unblock" : "Block"}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* 🏠 PG MANAGEMENT */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">
            PG Listings Overview
          </h2>
          {pgs.length === 0 ? (
            <p className="text-gray-600">No PG listings available.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pgs.map((pg) => (
                <div
                  key={pg._id}
                  className="border rounded-lg p-4 shadow-sm bg-slate-50 relative hover:shadow-md transition"
                >
                  <img
                    src={
                      pg.images?.[0] ||
                      "https://images.unsplash.com/photo-1590490360182-6639e1a1e851?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={pg.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <h3 className="font-semibold text-lg">{pg.name}</h3>
                  <p className="text-sm text-gray-600">{pg.city}</p>
                  <p className="text-indigo-600 font-medium mt-1">
                    ₹{pg.rent}/month
                  </p>

                  {/* 👤 OWNER DETAILS */}
                  <div className="mt-3 text-sm bg-white border rounded-md p-2">
                    <p>
                      <span className="font-semibold text-indigo-600">Owner:</span>{" "}
                      {pg.ownerId?.name || "Unknown"}
                    </p>
                    <p>
                      <span className="font-semibold text-indigo-600">Email:</span>{" "}
                      {pg.ownerId?.email || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold text-indigo-600">Phone:</span>{" "}
                      {pg.ownerId?.phone || "N/A"}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeletePG(pg._id)}
                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 📅 BOOKINGS OVERVIEW */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-indigo-700 flex items-center gap-2">
            <CalendarDays /> All Bookings
          </h2>

          {/* 🔍 Search Filter */}
          <div className="flex items-center gap-2 mb-4">
            <Search className="text-indigo-600" size={18} />
            <input
              type="text"
              placeholder="Search by tenant, PG, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-md px-3 py-1 w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {filteredBookings.length === 0 ? (
            <p className="text-gray-600">No bookings found.</p>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full text-sm border">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="p-2">Tenant</th>
                    <th className="p-2">PG Name</th>
                    <th className="p-2">Owner</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Check-In</th>
                    <th className="p-2">Check-Out</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b._id} className="border-b hover:bg-slate-50">
                      <td className="p-2">{b.userId?.name || "N/A"}</td>
                      <td className="p-2">{b.pgId?.name || "N/A"}</td>
                      <td className="p-2">{b.pgId?.ownerId?.name || "N/A"}</td>
                      <td className="p-2 text-indigo-600 font-medium">
                        ₹{b.totalAmount}
                      </td>
                      <td className="p-2">{formatDate(b.checkIn)}</td>
                      <td className="p-2">{formatDate(b.checkOut)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* 📊 Stat Card */
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition">
      <div className="text-indigo-600 flex justify-center mb-2">{icon}</div>
      <h3 className="text-lg font-semibold">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );
}

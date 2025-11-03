import React, { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";
import {
  Building2,
  Home,
  IndianRupee,
  Trash2,
  Plus,
  CalendarDays,
  Layers,
  Loader2,
  X,
  Upload,
  Pencil,
} from "lucide-react";

export default function OwnerDashboard({ user }) {
  const [pgs, setPgs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalPGs: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPG, setSelectedPG] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    rent: "",
    availableRooms: 1,
    facilities: "",
    images: [],
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadOwnerData();
  }, []);

  const loadOwnerData = async () => {
    try {
      const pgRes = await API.get("/pg", {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const bookingRes = await API.get("/bookings/owner", {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const ownerPGs = pgRes.data.filter(
        (pg) => pg.ownerId?._id === user._id || pg.ownerId === user._id
      );

      const totalRevenue = bookingRes.data.reduce(
        (sum, b) => sum + (b.totalAmount || 0),
        0
      );

      setPgs(ownerPGs);
      setBookings(bookingRes.data);
      setStats({
        totalPGs: ownerPGs.length,
        totalBookings: bookingRes.data.length,
        totalRevenue,
      });
    } catch (err) {
      console.error("Owner load error:", err);
      toast.error("Failed to load owner data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePG = async (pgId) => {
    if (!window.confirm("Are you sure you want to delete this PG?")) return;
    try {
      await API.delete(`/pg/${pgId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success("PG deleted successfully");
      loadOwnerData();
    } catch {
      toast.error("Failed to delete PG");
    }
  };

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toISOString().split("T")[0] : "-";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: e.target.files });
  };

  // 🏠 Open form for Add or Edit
  const openForm = (pg = null) => {
    if (pg) {
      setEditMode(true);
      setSelectedPG(pg);
      setFormData({
        name: pg.name,
        address: pg.address,
        city: pg.city,
        rent: pg.rent,
        availableRooms: pg.availableRooms,
        facilities: pg.facilities.join(", "),
        images: [],
      });
    } else {
      setEditMode(false);
      setFormData({
        name: "",
        address: "",
        city: "",
        rent: "",
        availableRooms: 1,
        facilities: "",
        images: [],
      });
    }
    setShowForm(true);
  };

  // ➕ Add or ✏️ Update PG
  const handleSubmitPG = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "facilities") {
          data.append(key, formData[key].split(",").map((f) => f.trim()));
        } else if (key === "images") {
          for (const file of formData.images) {
            data.append("images", file);
          }
        } else {
          data.append(key, formData[key]);
        }
      });

      if (editMode) {
        await API.put(`/pg/${selectedPG._id}`, data, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("PG updated successfully!");
      } else {
        await API.post("/pg", data, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("PG added successfully!");
      }

      setShowForm(false);
      setSelectedPG(null);
      loadOwnerData();
    } catch (err) {
      console.error("PG submit error:", err);
      toast.error(editMode ? "Failed to update PG" : "Failed to add PG");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading your dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8">
        {/* 🏷️ HEADER */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-indigo-700 mb-1">
              Welcome, {user.name}
            </h1>
            <p className="text-gray-600">
              Manage your PGs and bookings easily
            </p>
          </div>

          <button
            onClick={() => openForm()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            <Plus size={18} /> Add New PG
          </button>
        </div>

        {/* 📊 STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard
            title="Total PGs"
            value={stats.totalPGs}
            icon={<Building2 className="text-indigo-600" size={22} />}
          />
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={<CalendarDays className="text-green-600" size={22} />}
          />
          <StatCard
            title="Revenue"
            value={`₹${stats.totalRevenue}`}
            icon={<IndianRupee className="text-yellow-500" size={22} />}
          />
          <StatCard
            title="Rooms Available"
            value={pgs.reduce((sum, pg) => sum + (pg.availableRooms || 0), 0)}
            icon={<Layers className="text-blue-500" size={22} />}
          />
        </div>

        {/* 🏠 PG LISTINGS */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">
            My PG Listings
          </h2>

          {pgs.length === 0 ? (
            <p className="text-gray-600">You haven’t added any PGs yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pgs.map((pg) => (
                <div
                  key={pg._id}
                  className="bg-slate-50 border rounded-lg shadow-sm hover:shadow-lg transition p-4 relative"
                >
                  <img
                    src={
                      pg.images?.[0] ||
                      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={pg.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <h3 className="font-semibold text-lg">{pg.name}</h3>
                  <p className="text-sm text-gray-600">{pg.city}</p>
                  <p className="text-indigo-600 font-medium mt-1">
                    ₹{pg.rent}/month
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Rooms: {pg.availableRooms}
                  </p>

                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => openForm(pg)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded-full"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeletePG(pg._id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 📅 BOOKINGS OVERVIEW */}
        <section>
          <h2 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center gap-2">
            <Home /> PG Booking Details
          </h2>

          {bookings.length === 0 ? (
            <p className="text-gray-600">No bookings yet for your PGs.</p>
          ) : (
            <div className="overflow-x-auto border rounded-lg shadow-sm">
              <table className="min-w-full text-sm">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="p-2">Tenant</th>
                    <th className="p-2">Contact</th>
                    <th className="p-2">PG Name</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Check-In</th>
                    <th className="p-2">Check-Out</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} className="border-b hover:bg-slate-50">
                      <td className="p-2">
                        {b.tenantName || b.userId?.name || "N/A"}
                      </td>
                      <td className="p-2">{b.tenantContact || "N/A"}</td>
                      <td className="p-2">{b.pgId?.name || "N/A"}</td>
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

      {/* 🏗️ ADD/EDIT PG MODAL */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X size={18} />
            </button>
            <h2 className="text-xl font-bold text-indigo-700 mb-4">
              {editMode ? "Update PG Details" : "Add New PG"}
            </h2>

            <form onSubmit={handleSubmitPG} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="PG Name"
                value={formData.name}
                onChange={handleChange}
                className="border rounded-md w-full p-2"
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="border rounded-md w-full p-2"
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="border rounded-md w-full p-2"
                required
              />
              <input
                type="number"
                name="rent"
                placeholder="Rent per month"
                value={formData.rent}
                onChange={handleChange}
                className="border rounded-md w-full p-2"
                required
              />
              <input
                type="number"
                name="availableRooms"
                placeholder="Available Rooms"
                value={formData.availableRooms}
                onChange={handleChange}
                className="border rounded-md w-full p-2"
              />
              <input
                type="text"
                name="facilities"
                placeholder="Facilities (comma separated)"
                value={formData.facilities}
                onChange={handleChange}
                className="border rounded-md w-full p-2"
              />
              <label className="block text-sm font-medium text-gray-700">
                Upload Images
              </label>
              <input
                type="file"
                name="images"
                multiple
                onChange={handleFileChange}
                className="border rounded-md w-full p-2"
                accept="image/*"
              />
              <button
                type="submit"
                disabled={formLoading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-70"
              >
                {formLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />{" "}
                    {editMode ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    <Upload size={18} />{" "}
                    {editMode ? "Update PG" : "Add PG"}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* 📊 Stat Card */
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white border border-indigo-100 rounded-xl p-4 shadow hover:shadow-md transition flex flex-col items-center text-center">
      <div className="mb-2">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-700">{value}</h3>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";
import {
  Home,
  CalendarDays,
  IndianRupee,
  Loader2,
  X,
  MapPin,
  Building2,
  Trash2,
  FileDown,
} from "lucide-react";

export default function TenantDashboard({ user }) {
  const [bookings, setBookings] = useState([]);
  const [pgs, setPgs] = useState([]);
  const [stats, setStats] = useState({ totalBookings: 0, totalSpent: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedPG, setSelectedPG] = useState(null);
  const [bookingModal, setBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    tenantName: "",
    tenantContact: "",
    checkIn: "",
    checkOut: "",
    totalAmount: 0,
  });
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  useEffect(() => {
    loadTenantData();
  }, []);

  const loadTenantData = async () => {
    try {
      const [bookingRes, pgRes] = await Promise.all([
        API.get("/bookings/my", {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
        API.get("/pg"),
      ]);

      const totalSpent = bookingRes.data.reduce(
        (sum, b) => sum + (b.totalAmount || 0),
        0
      );

      setBookings(bookingRes.data);
      setPgs(pgRes.data);
      setStats({
        totalBookings: bookingRes.data.length,
        totalSpent,
      });
    } catch (err) {
      console.error("Tenant load error:", err);
      toast.error("Failed to load tenant data");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await API.put(`/bookings/${id}/cancel`, null, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success("Booking cancelled successfully");
      loadTenantData();
    } catch {
      toast.error("Failed to cancel booking");
    }
  };

  const handleDownloadInvoice = async (id) => {
    try {
      const res = await API.get(`/bookings/${id}/invoice`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error("Failed to download invoice");
    }
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...bookingData, [name]: value };

    // Auto calculate rent per day × number of days
    if (selectedPG && updated.checkIn && updated.checkOut) {
      const start = new Date(updated.checkIn);
      const end = new Date(updated.checkOut);
      const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        updated.totalAmount = Math.round((selectedPG.rent / 30) * diffDays);
      } else {
        updated.totalAmount = 0;
      }
    }

    setBookingData(updated);
  };

  const handleBookNow = async (e) => {
    e.preventDefault();
    if (!selectedPG) return;

    const { tenantName, tenantContact, checkIn, checkOut, totalAmount } =
      bookingData;

    // Validation
    const contactRegex = /^[6-9]\d{9}$/;
    if (!tenantName || !tenantContact || !checkIn || !checkOut) {
      return toast.warn("Please fill all fields before confirming booking");
    }

    if (!contactRegex.test(tenantContact)) {
      return toast.error("Please enter a valid contact number");
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      return toast.error("Check-out date must be after check-in date");
    }

    if (totalAmount <= 0) {
      return toast.error("Invalid booking duration");
    }

    setIsBookingLoading(true);

    try {
      const payload = {
        pgId: selectedPG._id,
        tenantName,
        tenantContact,
        checkIn,
        checkOut,
        totalAmount,
      };

      await API.post("/bookings", payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      toast.success("Booking successful!");
      setBookingModal(false);
      setSelectedPG(null);
      setBookingData({
        tenantName: "",
        tenantContact: "",
        checkIn: "",
        checkOut: "",
        totalAmount: 0,
      });
      loadTenantData();
    } catch (err) {
      console.error("Booking error:", err);
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setIsBookingLoading(false);
    }
  };

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toISOString().split("T")[0] : "-";

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading your dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-indigo-700 mb-1">
              Welcome, {user.name}
            </h1>
            <p className="text-gray-600">Find and manage your PG bookings</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={<CalendarDays className="text-indigo-600" size={22} />}
          />
          <StatCard
            title="Total Spent"
            value={`₹${stats.totalSpent}`}
            icon={<IndianRupee className="text-green-600" size={22} />}
          />
          <StatCard
            title="Available PGs"
            value={pgs.length}
            icon={<Building2 className="text-blue-600" size={22} />}
          />
        </div>

        {/* PG Listings */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">
            🏠 Available PGs
          </h2>
          {pgs.length === 0 ? (
            <p className="text-gray-600">No PGs available right now.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pgs.map((pg) => (
                <div
                  key={pg._id}
                  className="bg-slate-50 border rounded-lg shadow-sm hover:shadow-lg transition p-4 flex flex-col"
                >
                  <img
                    src={
                      pg.images?.[0] ||
                      "https://images.unsplash.com/photo-1560184897-64c1c8262f1b?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={pg.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <h3 className="font-semibold text-lg text-gray-800">
                    {pg.name}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin size={14} /> {pg.city}
                  </p>
                  <p className="text-indigo-600 font-medium mt-1">
                    ₹{pg.rent}/month
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Rooms Available: {pg.availableRooms}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedPG(pg);
                      setBookingModal(true);
                    }}
                    className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* My Bookings */}
        <section>
          <h2 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center gap-2">
            <CalendarDays /> My Bookings
          </h2>
          {bookings.length === 0 ? (
            <p className="text-gray-600">You haven’t made any bookings yet.</p>
          ) : (
            <div className="overflow-x-auto border rounded-lg shadow-sm">
              <table className="min-w-full text-sm">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="p-2">PG Name</th>
                    <th className="p-2">City</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Check-In</th>
                    <th className="p-2">Check-Out</th>
                    <th className="p-2">Status</th>
                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} className="border-b hover:bg-slate-50">
                      <td className="p-2">{b.pgId?.name || "N/A"}</td>
                      <td className="p-2">{b.pgId?.city || "N/A"}</td>
                      <td className="p-2 text-indigo-600 font-medium">
                        ₹{b.totalAmount}
                      </td>
                      <td className="p-2">{formatDate(b.checkIn)}</td>
                      <td className="p-2">{formatDate(b.checkOut)}</td>
                      <td
                        className={`p-2 font-medium ${
                          b.status === "cancelled"
                            ? "text-red-500"
                            : "text-green-600"
                        }`}
                      >
                        {b.status || "active"}
                      </td>
                      <td className="p-2 text-center flex justify-center gap-3">
                        {b.status !== "cancelled" && (
                          <button
                            onClick={() => handleCancelBooking(b._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Cancel Booking"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDownloadInvoice(b._id)}
                          className="text-indigo-600 hover:text-indigo-800"
                          title="Download Invoice"
                        >
                          <FileDown size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Booking Modal */}
      {bookingModal && selectedPG && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-lg">
            <button
              onClick={() => setBookingModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X size={18} />
            </button>

            <h2 className="text-2xl font-bold text-indigo-700 mb-2">
              Book {selectedPG.name}
            </h2>
            <p className="text-gray-600 mb-4">
              ₹{selectedPG.rent}/month · {selectedPG.city}
            </p>

            <form onSubmit={handleBookNow} className="space-y-3">
              <input
                type="text"
                name="tenantName"
                placeholder="Your Name"
                value={bookingData.tenantName}
                onChange={handleBookingChange}
                className="border rounded-md w-full p-2"
                required
              />
              <input
                type="tel"
                name="tenantContact"
                placeholder="Contact Number"
                value={bookingData.tenantContact}
                onChange={handleBookingChange}
                className="border rounded-md w-full p-2"
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-700">Check-In</label>
                  <input
                    type="date"
                    name="checkIn"
                    value={bookingData.checkIn}
                    onChange={handleBookingChange}
                    className="border rounded-md w-full p-2 mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Check-Out</label>
                  <input
                    type="date"
                    name="checkOut"
                    value={bookingData.checkOut}
                    onChange={handleBookingChange}
                    className="border rounded-md w-full p-2 mt-1"
                    required
                  />
                </div>
              </div>

              {/* Total Rent Preview */}
              <div className="mt-3 bg-indigo-50 p-3 rounded-md text-center border">
                <p className="text-sm text-gray-600">Total Payable Rent</p>
                <p className="text-xl font-semibold text-indigo-700">
                  ₹{bookingData.totalAmount || selectedPG.rent}
                </p>
              </div>

              <button
                type="submit"
                disabled={isBookingLoading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 mt-3"
              >
                {isBookingLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Booking...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* Stat Card */
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white border border-indigo-100 rounded-xl p-4 shadow hover:shadow-md transition flex flex-col items-center text-center">
      <div className="mb-2">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-700">{value}</h3>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  );
}

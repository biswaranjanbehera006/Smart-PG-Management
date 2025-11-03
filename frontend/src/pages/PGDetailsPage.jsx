import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { toast } from "react-toastify";
import {
  Home,
  MapPin,
  BedDouble,
  IndianRupee,
  Phone,
  CalendarDays,
  Loader2,
} from "lucide-react";

export default function PGDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // booking fields
  const [tenantName, setTenantName] = useState("");
  const [tenantContact, setTenantContact] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchPG();
  }, [id]);

  // auto calculate rent based on duration
  useEffect(() => {
    if (pg && checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        const total = Math.round((pg.rent / 30) * diffDays); // rent per day × days
        setTotalAmount(total);
      } else {
        setTotalAmount(0);
      }
    }
  }, [checkIn, checkOut, pg]);

  const fetchPG = async () => {
    try {
      const { data } = await API.get(`/pg/${id}`);
      setPg(data);
    } catch (err) {
      console.error("Error fetching PG:", err);
      toast.error("Failed to load PG details");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.info("Please login to book a PG");
      return navigate("/login");
    }

    if (!tenantName || !tenantContact || !checkIn || !checkOut) {
      return toast.error("All fields are required");
    }

    const contactRegex = /^[6-9]\d{9}$/;
    if (!contactRegex.test(tenantContact)) {
      return toast.error("Please enter a valid contact number");
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      return toast.error("Check-out date must be after check-in date");
    }

    setBookingLoading(true);
    try {
      const { data } = await API.post(
        "/bookings",
        {
          pgId: id,
          tenantName,
          tenantContact,
          checkIn,
          checkOut,
          totalAmount,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      toast.success("Booking successful! Confirmation email sent.");
      navigate("/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message || "Booking failed";
      toast.error(msg);
      console.error("Booking error:", err);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        <Loader2 className="animate-spin mr-2" /> Loading PG details...
      </div>
    );

  if (!pg)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        PG not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        {/* 🖼️ Image */}
        <img
          src={
            pg.images?.[0] ||
            "https://images.unsplash.com/photo-1590490360182-6639e1a1e851?auto=format&fit=crop&w=1000&q=80"
          }
          alt={pg.name}
          className="w-full h-64 object-cover"
        />

        {/* 📋 PG Info */}
        <div className="p-6 md:p-8 space-y-3">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Home className="text-indigo-600" /> {pg.name}
          </h1>

          <p className="text-gray-600 flex items-center gap-2">
            <MapPin className="text-indigo-500" size={18} />
            {pg.address}, {pg.city}
          </p>

          <p className="text-lg text-indigo-600 font-medium flex items-center gap-2">
            <IndianRupee size={18} /> {pg.rent} / month
          </p>

          <p className="text-gray-700 flex items-center gap-2">
            <BedDouble size={18} /> Rooms Available:{" "}
            <span className="font-semibold">{pg.availableRooms}</span>
          </p>

          {/* Facilities */}
          {pg.facilities?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mt-4 mb-2">
                Facilities:
              </h3>
              <div className="flex flex-wrap gap-2">
                {pg.facilities.map((f, i) => (
                  <span
                    key={i}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Owner Info */}
          {pg.ownerId && (
            <div className="border-t border-slate-200 pt-4 mt-4 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <Phone size={16} className="text-indigo-500" /> PG Owner:{" "}
                <span className="font-semibold">
                  {pg.ownerId.name || "N/A"} ({pg.ownerId.email})
                </span>
              </p>
            </div>
          )}

          {/* Booking Form */}
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold text-indigo-700 mb-3 flex items-center gap-2">
              <CalendarDays /> Book This PG
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                className="border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <input
                type="text"
                placeholder="Contact Number"
                value={tenantContact}
                onChange={(e) => setTenantContact(e.target.value)}
                className="border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            {/* Total Price */}
            {totalAmount > 0 && (
              <div className="mt-3 text-indigo-700 font-semibold">
                Total Amount: ₹{totalAmount}
              </div>
            )}

            <button
              onClick={handleBooking}
              disabled={bookingLoading}
              className="mt-4 w-full py-2 flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition disabled:opacity-60"
            >
              {bookingLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Processing...
                </>
              ) : (
                "Confirm Booking"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

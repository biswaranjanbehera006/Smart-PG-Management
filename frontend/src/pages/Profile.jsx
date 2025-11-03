import React, { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";
import { Loader2, Camera, FileDown } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", password: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) return toast.error("Please log in again.");

      const { data } = await API.get("/auth/profile", {
        headers: { Authorization: `Bearer ${storedUser.token}` },
      });

      setUser(data);
      setFormData({ name: data.name, phone: data.phone || "", password: "" });
      await fetchBookings(storedUser.token);
    } catch (err) {
      console.error("Profile fetch error:", err);
      toast.error("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async (token) => {
    try {
      const { data } = await API.get("/bookings/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(data);
    } catch (err) {
      console.error("Bookings fetch error:", err);
      toast.error("Failed to load bookings.");
    }
  };

  // 📸 Upload profile photo to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
      formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        await API.put(
          "/auth/profile",
          { profilePic: data.secure_url },
          {
            headers: { Authorization: `Bearer ${storedUser.token}` },
          }
        );
        toast.success("Profile picture updated!");
        fetchProfile();
      } else {
        toast.error("Upload failed. Try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const { data } = await API.put("/auth/profile", formData, {
        headers: { Authorization: `Bearer ${storedUser.token}` },
      });

      toast.success("Profile updated successfully!");
      localStorage.setItem("user", JSON.stringify(data));
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("Failed to update profile.");
    }
  };

  const handleDownloadInvoice = async (id) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const response = await API.get(`/bookings/${id}/invoice`, {
        headers: { Authorization: `Bearer ${storedUser.token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      toast.error("Failed to download invoice");
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <Loader2 className="animate-spin mr-2" /> Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-10">
        {/* 👤 Profile Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-8 border-b pb-6 mb-6">
          <div className="relative mx-auto md:mx-0">
            <img
              src={
                user?.profilePic ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-4 border-indigo-500 shadow"
            />
            <label className="absolute bottom-2 right-2 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700 text-white">
              {uploading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Camera size={18} />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-indigo-700">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-gray-500 capitalize">{user?.role}</p>

            <button
              onClick={() => setEditMode(true)}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* ✏️ Edit Profile Form */}
        {editMode && (
          <form
            onSubmit={handleUpdateProfile}
            className="bg-slate-50 border rounded-lg p-4 md:p-6 mb-8"
          >
            <h3 className="text-lg font-semibold mb-3 text-indigo-700">
              Update Profile
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border rounded-md w-full p-2"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="border rounded-md w-full p-2"
              />
              {/* <input
                type="password"
                name="password"
                placeholder="New Password (optional)"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="border rounded-md w-full p-2 md:col-span-2"
              /> */}
            </div>
            <div className="flex justify-end mt-4 gap-3">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* 🧾 My Bookings */}
        <div>
          <h3 className="text-xl font-semibold text-indigo-700 mb-4">
            My Bookings
          </h3>

          {bookings.length === 0 ? (
            <p className="text-gray-600">No bookings yet.</p>
          ) : (
            <div className="overflow-x-auto border rounded-lg shadow-sm">
              <table className="min-w-full text-sm">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="p-3 text-left">PG Name</th>
                    <th className="p-3 text-left">City</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Check-In</th>
                    <th className="p-3 text-left">Check-Out</th>
                    <th className="p-3 text-center">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} className="border-b hover:bg-slate-50">
                      <td className="p-3">{b.pgId?.name}</td>
                      <td className="p-3">{b.pgId?.city}</td>
                      <td className="p-3 text-indigo-600 font-medium">
                        ₹{b.totalAmount}
                      </td>
                      <td className="p-3">
                        {new Date(b.checkIn).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        {new Date(b.checkOut).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDownloadInvoice(b._id)}
                          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 mx-auto"
                        >
                          <FileDown size={16} /> Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

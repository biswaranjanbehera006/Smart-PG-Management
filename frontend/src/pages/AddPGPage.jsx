import React, { useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AddPGPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    rent: "",
    availableRooms: "",
    facilities: "",
  });
  const [images, setImages] = useState([]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onFileChange = (e) => setImages([...e.target.files]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("You must be logged in to add a PG.");

    if (!form.name || !form.address || !form.city || !form.rent) {
      return toast.error("Please fill all required fields.");
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    formData.append("facilities", form.facilities.split(",").map(f => f.trim()));
    images.forEach((img) => formData.append("images", img));

    setLoading(true);
    try {
      const { data } = await API.post("/pg", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("PG added successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("PG Add Error:", err);
      toast.error(err?.response?.data?.message || "Failed to create PG.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          🏠 Add New PG
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* PG Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              PG Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-400"
              placeholder="e.g. Sunshine Residency"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={onChange}
              rows="3"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-400"
              placeholder="123, MG Road, Sector 45..."
            ></textarea>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-400"
              placeholder="e.g. Bangalore"
            />
          </div>

          {/* Rent & Rooms */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Monthly Rent (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="rent"
                value={form.rent}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-400"
                placeholder="5000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Available Rooms
              </label>
              <input
                type="number"
                name="availableRooms"
                value={form.availableRooms}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-400"
                placeholder="1"
              />
            </div>
          </div>

          {/* Facilities */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Facilities (comma-separated)
            </label>
            <input
              type="text"
              name="facilities"
              value={form.facilities}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-400"
              placeholder="WiFi, Laundry, Meals, Parking"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Upload Images (max 5)
            </label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={onFileChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-400"
            />
            {images.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">{images.length} file(s) selected</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            className={`w-full py-2 rounded-md text-white font-medium transition ${
              loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Uploading..." : "Add PG"}
          </button>
        </form>
      </div>
    </div>
  );
}

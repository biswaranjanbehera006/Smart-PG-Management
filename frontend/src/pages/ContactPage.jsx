import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../api/api";
import { Star, Send, User, Phone, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    rating: 0,
    comment: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRating = (value) => {
    setFormData({ ...formData, rating: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, contact, rating, comment } = formData;

    if (!name || !contact || !rating || !comment) {
      return toast.warn("Please fill out all fields before submitting!");
    }

    setLoading(true);
    try {
      await API.post("/feedback", formData);
      toast.success("Thanks for giving your feedback!");
      setFormData({ name: "", contact: "", rating: 0, comment: "" });
    } catch (err) {
      console.error("Feedback error:", err);
      toast.error("Failed to send feedback. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white flex justify-center items-center px-4 py-16">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 md:p-10">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-2">
          We Value Your Feedback 💬
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Help us improve your experience by sharing your thoughts!
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name + Contact */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute top-3 left-3 text-indigo-500" size={18} />
              <input
                type="text"
                name="name"
                placeholder="Your Full Name"
                value={formData.name}
                onChange={handleChange}
                className="border pl-10 pr-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            <div className="relative">
              <Phone className="absolute top-3 left-3 text-indigo-500" size={18} />
              <input
                type="tel"
                name="contact"
                placeholder="Contact Number"
                value={formData.contact}
                onChange={handleChange}
                className="border pl-10 pr-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>
          </div>

          {/* Rating */}
          <div className="text-center sm:text-left">
            <label className="block mb-2 font-medium text-gray-700">
              Rate your experience
            </label>
            <div className="flex justify-center sm:justify-start gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={28}
                  onClick={() => handleRating(star)}
                  className={`cursor-pointer transition ${
                    formData.rating >= star
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Comment Box */}
          <div className="relative">
            <MessageSquare
              className="absolute top-3 left-3 text-indigo-500"
              size={18}
            />
            <textarea
              name="comment"
              rows="4"
              placeholder="Write your feedback..."
              value={formData.comment}
              onChange={handleChange}
              className="border pl-10 pr-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg text-lg font-medium transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Send className="animate-pulse" size={18} /> Sending...
              </>
            ) : (
              <>
                <Send size={18} /> Submit Feedback
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

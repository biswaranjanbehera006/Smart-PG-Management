import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-indigo-700 to-indigo-900 text-white mt-20">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold mb-3">SmartPG</h2>
          <p className="text-gray-200 text-sm leading-relaxed">
            Discover, book, and manage your perfect PG stay — all in one place.
            SmartPG simplifies your living experience with seamless booking,
            payments, and management.
          </p>
          <div className="flex gap-4 mt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
            >
              <Twitter size={18} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-l-4 border-white pl-2">
            Quick Links
          </h3>
          <ul className="space-y-2 text-gray-200">
            <li>
              <Link
                to="/"
                className="hover:text-white hover:underline transition"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/pgs"
                className="hover:text-white hover:underline transition"
              >
                PGs
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="hover:text-white hover:underline transition"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-white hover:underline transition"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-l-4 border-white pl-2">
            Contact Info
          </h3>
          <ul className="space-y-3 text-gray-200">
            <li className="flex items-center gap-3">
              <MapPin size={18} className="text-white" />
              <span>SmartPG HQ, Bangalore, India</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-white" />
              <a
                href="tel:+919999999999"
                className="hover:text-white hover:underline"
              >
                +91 99999 99999
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-white" />
              <a
                href="mailto:rayrituparna78@gmail.com"
                className="hover:text-white hover:underline"
              >
                rayrituparna78@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter / Feedback */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-l-4 border-white pl-2">
            Stay Connected
          </h3>
          <p className="text-gray-200 text-sm mb-3">
            Subscribe for updates, offers, and new PG listings.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you for subscribing to SmartPG!");
              e.target.reset();
            }}
            className="flex flex-col sm:flex-row items-center gap-2"
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="w-full sm:flex-1 px-3 py-2 rounded-md text-gray-800 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-white text-indigo-700 px-4 py-2 rounded-md font-semibold hover:bg-indigo-100 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/20"></div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-gray-300 text-sm">
        <p>
          © {new Date().getFullYear()} <span className="font-semibold">SmartPG</span>. All rights reserved.
        </p>
        <p className="mt-2 sm:mt-0">
          Built with ❤️ by{" "}
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline"
          >
            SmartPG Team
          </a>
        </p>
      </div>
    </footer>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  // ✅ Load user data from localStorage & re-render when it changes
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    loadUser(); // Run immediately
    window.addEventListener("storage", loadUser); // Listen for updates
    return () => window.removeEventListener("storage", loadUser);
  }, [location]);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          SmartPG
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <NavLink to="/" label="Home" location={location} />
          <NavLink to="/pgs" label="PGs" location={location} />
          <NavLink to="/contact" label="Contact Us" location={location} />

          {user ? (
            <>
              <NavLink to="/dashboard" label="Dashboard" location={location} />

              {/* 🧍 Profile Section */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 focus:outline-none transition-transform"
                >
                  <img
                    src={
                      user.photo ||
                      user.profilePic ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-indigo-600 cursor-pointer object-cover"
                  />
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 transition-all duration-150"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50"
                    >
                      My Profile
                    </button>

                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        handleLogout();
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" label="Login" location={location} />
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-6 pb-4 space-y-3">
          <MobileNavLink to="/" label="Home" onClick={toggleMenu} />
          <MobileNavLink to="/pgs" label="PGs" onClick={toggleMenu} />
          <MobileNavLink to="/contact" label="Contact Us" onClick={toggleMenu} />

          {user ? (
            <>
              <MobileNavLink
                to="/dashboard"
                label="Dashboard"
                onClick={toggleMenu}
              />
              <MobileNavLink
                to="/profile"
                label="My Profile"
                onClick={toggleMenu}
              />
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="w-full text-left bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <MobileNavLink to="/login" label="Login" onClick={toggleMenu} />
              <Link
                to="/register"
                className="block bg-indigo-600 text-white px-4 py-2 rounded-md text-center hover:bg-indigo-700"
                onClick={toggleMenu}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

/* Helper Components */
function NavLink({ to, label, location }) {
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`text-gray-700 hover:text-indigo-600 ${
        active ? "text-indigo-600 font-semibold" : ""
      }`}
    >
      {label}
    </Link>
  );
}

function MobileNavLink({ to, label, onClick }) {
  return (
    <Link
      to={to}
      className="block text-gray-700 hover:text-indigo-600"
      onClick={onClick}
    >
      {label}
    </Link>
  );
}

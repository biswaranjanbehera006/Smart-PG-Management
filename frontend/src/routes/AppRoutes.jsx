import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// 🏠 Pages
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import PGListPage from "../pages/PGListPage";
import PGDetailsPage from "../pages/PGDetailsPage";
import DashboardPage from "../pages/DashboardPage";
import AddPGPage from "../pages/AddPGPage";
import Profile from "../pages/Profile"; // ✅ your provided Profile.jsx
import ContactPage from "../pages/ContactPage";



// 🧭 Components
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// 🔒 Private Route Wrapper
function PrivateRoute({ children }) {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/login" replace />;
}

// 🌍 Main App Router
export default function AppRoutes() {
  return (
    <Router>
      {/* ✅ Global Navbar */}
      <Navbar />

      {/* Padding to prevent navbar overlap */}
      <div className="pt-20">
        <Routes>
          {/* 🌐 Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/pgs" element={<PGListPage />} />
          <Route path="/pg/:id" element={<PGDetailsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* 🔐 Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/add-pg"
            element={
              <PrivateRoute>
                <AddPGPage />
              </PrivateRoute>
            }
          />

          {/* 👤 Profile Page (includes bookings & invoice download) */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* 🚫 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

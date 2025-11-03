import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OwnerDashboard from "./OwnerDashboard";
import TenantDashboard from "./TenantDashboard";
import AdminDashboard from "./AdminDashboard";
import { toast } from "react-toastify";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) return navigate("/login");
    setUser(stored);
  }, [navigate]);

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-600">
        Loading dashboard...
      </div>
    );

  return (
    <>
      {user.role === "owner" && <OwnerDashboard user={user} />}
      {user.role === "tenant" && <TenantDashboard user={user} />}
      {user.role === "admin" && <AdminDashboard user={user} />}
    </>
  );
}

import { Route, Routes, Navigate } from "react-router-dom";
import { toast } from "sonner";

import Login from "./Auth/Login/Login";
import Register from "./Auth/Register/Register";
import { Home } from "./Pages/Home";
import { AdminDashboard } from "./Dashboards/Admin/AdminDashboard";

import { useAuth } from "./context/auth";
import ProtectedRoute from "./context/Secure/ProctedRoute";
import DashboardRedirect from "./context/Secure/DashboradRedirect";

export const App = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      {/* PUBLIC */}
      <Route
        path="/"
        element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route path="/register" element={<Register />} />

      {/* DASHBOARD REDIRECT */}
      <Route path="/dashboard" element={<DashboardRedirect />} />

      {/* USER */}
      <Route  element={<ProtectedRoute role="user" />}>
        <Route path="/dashboard/auth/user" element={<Home />} />
      </Route>

      {/* ADMIN */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/dashboard/auth/admin" element={<AdminDashboard />} />
      </Route>

      {/* FALLBACK */}
      <Route
        path="*"
        element={
          isLoggedIn ? (
            <Navigate to="/auth/user" />
          ) : (
            <>
              <Navigate to="/" />
            </>
          )
        }
      />
    </Routes>
  );
};

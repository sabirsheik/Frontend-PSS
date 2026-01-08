import { Route, Routes, Navigate } from "react-router-dom";

import Login from "./Ui/Components/Auth/Login/Login";
import Register from "./Ui/Components/Auth/Register/Register";
import { Analyst } from "./Dashboards/Analyst/Analyst";
import { AdminDashboard } from "./Dashboards/Admin/AdminDashboard";

import { useAuth } from "./context/auth";
import ProtectedRoute from "./context/Secure/ProctectedRoute";
import DashboardRedirect from "./context/Secure/DashboradRedirect";
import ForgetPasswordModal from "./Ui/Components/Auth/ForgetPasswordModal/ForgetPasswordModal";
import ResetPassword from "./Ui/Components/Auth/ResetPassword/ResetPassword";

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
      <Route path="/forget-password" element={<ForgetPasswordModal />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* DASHBOARD REDIRECT */}
      <Route path="/dashboard" element={<DashboardRedirect />} />

      {/* USER */}
      <Route element={<ProtectedRoute role="user" />}>
        <Route path="/dashboard/auth/user" element={<Analyst />} />
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
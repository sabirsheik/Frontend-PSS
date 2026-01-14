import { Route, Routes, Navigate } from "react-router-dom";

import Login from "./Ui/Pages/Auth/Login/Login";
import Register from "./Ui/Pages/Auth/Register/Register";
import { Analyst } from "./Dashboards/Analyst/Analyst";
import { AdminDashboard } from "./Dashboards/Admin/AdminDashboard";

import { useAuth } from "./context/auth";
import ProtectedRoute from "./context/Secure/ProctectedRoute";
import DashboardRedirect from "./context/Secure/DashboradRedirect";
import ForgetPasswordModal from "./Ui/Pages/Auth/ForgetPasswordModal/ForgetPasswordModal";
import ResetPassword from "./Ui/Pages/Auth/ResetPassword/ResetPassword";
import NOX from "./Ui/Pages/NOX/NOX";
import Header from "./Ui/Components/Header/header";

export const App = () => {
  const { isLoggedIn } = useAuth();

  return (
    <>
      {isLoggedIn && <Header />}
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
        <Route path="/dashboard/auth/user" element={<Analyst />} >
        <Route path="nox" element={<NOX />} />
        </Route>
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
     </>
  );
};
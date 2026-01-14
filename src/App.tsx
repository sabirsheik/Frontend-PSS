import { Route, Routes, Navigate } from "react-router-dom";

import Login from "./Ui/Pages/Auth/Login/Login";
import Register from "./Ui/Pages/Auth/Register/Register";
import { Analyst } from "./Dashboards/Analyst/Analyst";
import { AdminDashboard } from "./Dashboards/Admin/AdminDashboard";

import { useAuth } from "./context/auth";
import ProtectedRoute from "./context/Secure/ProctectedRoute";
import DashboardRedirect from "./context/Secure/DashboradRedirect";
import ForgetPasswordModal from "./Ui/Pages/Auth/ForgetPasswordModal/ForgetPasswordModal";
import NOX from "./Ui/Pages/NOX/NOX";
import Header from "./Ui/Components/Header/header";
import Facial from "./Ui/Pages/Facial/Facial";
import Dossiers from "./Ui/Pages/Dossiers/Dossiers";
import NTOC from "./Ui/Pages/NTOC/NTOC";
import INT from "./Ui/Pages/INT/INT";
import FIU from "./Ui/Pages/FIU/FIU";
import Link from "./Ui/Pages/Links/Link";

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

        {/* DASHBOARD REDIRECT */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* USER */}
        <Route element={<ProtectedRoute role="user" />}>
          <Route path="/dashboard/auth/user" element={<Analyst />}>
            <Route path="link" element={<Link />} />
            <Route path="nox" element={<NOX />} />
            <Route path="fiu" element={<FIU />} />
            <Route path="facial" element={<Facial />} />
            <Route path="int" element={<INT />} />
            <Route path="ntoc" element={<NTOC />} />
            <Route path="dossiers" element={<Dossiers />} />
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

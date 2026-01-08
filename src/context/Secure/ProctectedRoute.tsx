import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth";

const ProtectedRoute = ({ role }: { role: "user" | "admin" }) => {
  const { isLoggedIn, isLoading, user } = useAuth();

  if (isLoading) return null;
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (user?.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

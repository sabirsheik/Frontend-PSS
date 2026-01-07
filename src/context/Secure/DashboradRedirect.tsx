import { Navigate } from "react-router-dom";
import { useAuth } from "../auth";

const DashboardRedirect = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user?.role === "admin") return <Navigate to="/dashboard/auth/admin" replace />;
  if (user?.role === "user") return <Navigate to="/dashboard/auth/user" replace />;

  return <Navigate to="/" replace />;
};

export default DashboardRedirect;
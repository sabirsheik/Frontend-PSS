import { Navigate } from "react-router-dom";
import { useUser } from "../../Hook/Auth/useAuth";

const DashboardRedirect = () => {
  const { data: user, isLoading } = useUser();

  if (isLoading) return null;

  if (user?.role === "admin") return <Navigate to="/dashboard/auth/admin" replace />;
  if (user?.role === "user") return <Navigate to="/dashboard/auth/user" replace />;

  return <Navigate to="/" replace />;
};

export default DashboardRedirect;
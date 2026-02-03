import { Navigate } from "react-router-dom";
// Hook to get user data
import { useUser } from "../../Hook/Auth/useAuth";

const DashboardRedirect = () => {
  // Get user data
  const { data: user, isLoading } = useUser();

  if (isLoading) return null;
  // if Admin login redirect to admin dashboard
  if (user?.role === "admin") return <Navigate to="/dashboard/auth/admin" replace />;
  // if User or Analyst login redirect to user dashboard
  if (user?.role === "user" || user?.role === "analyst") return <Navigate to="/dashboard/auth/user" replace />;
  // if not logged in redirect to login Page
  return <Navigate to="/" replace />;
};

export default DashboardRedirect;
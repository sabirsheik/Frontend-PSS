import { useUser } from "../../Hook/Auth/useAuth";
import { Navigate } from "react-router-dom";

const DashboardRedirect = () => {
  // Get user data
  const { data: user } = useUser();
  // Check if user is logged in
  const isLoggedIn = !!user;

  // Logged in user redirection
  if (isLoggedIn) {
    // Admin dashboard
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    // Analyst dashboard
    if (user?.role === "analyst") {
      return <Navigate to="/analyst" replace />;
    }
  }
  // Not logged in
  return <Navigate to="/login" replace />;
};

export default DashboardRedirect;

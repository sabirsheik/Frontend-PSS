// DashboardRedirect Component
import { useAuth } from "../auth";
import { Navigate } from "react-router-dom";
// import PageLoader from "../Components/Loader/PageLoader";

const DashboardRedirect = () => {
  const { user, isLoggedIn } = useAuth();

  // Redirect rules
  if (isLoggedIn) {
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    if (user?.role === "analyst") {
      return <Navigate to="/analyst" replace />; // Manager goes to admin layout but sees filtered menu
    }
  }

  // Not logged in
  return <Navigate to="/login" replace />;
};

export default DashboardRedirect;
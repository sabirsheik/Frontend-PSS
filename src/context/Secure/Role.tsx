import { useUser } from "../../Hook/Auth/useAuth";
import { Navigate } from "react-router-dom";


const DashboardRedirect = () => {
  const { data: user } = useUser();
  const isLoggedIn = !!user;

  // Redirect rules
  if (isLoggedIn) {
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    if (user?.role === "analyst") {
      return <Navigate to="/analyst" replace />; 
    }
  }

  // Not logged in
  return <Navigate to="/login" replace />;
};

export default DashboardRedirect;
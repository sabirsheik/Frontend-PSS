import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../Hook/Auth/useAuth";
// Protected Route Component
const ProtectedRoute = ({ role }: { role: "user" | "admin" }) => {
  // Get user data
  const { data: user, isLoading } = useUser();
  // Check if user is logged in
  const isLoggedIn = !!user;

  if (isLoading) return null;
  // If not logged in redirect to login Page
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
//  If user role does not match, redirect to login Page
  if (user?.role !== role && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

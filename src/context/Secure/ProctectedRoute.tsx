import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../Hook/Auth/useAuth";

const ProtectedRoute = ({ role }: { role: "user" | "admin" }) => {
  const { data: user, isLoading } = useUser();
  const isLoggedIn = !!user;

  if (isLoading) return null;
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (user?.role !== role && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

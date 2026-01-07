import { useAuth } from "@/context/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const DashboradHeader = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };
  return (
    <>
      <div className="">
        <h1>Header</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </>
  );
};

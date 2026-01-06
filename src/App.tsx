// import { Button } from "./components/ui/button";
import { toast } from "sonner";
import Login from "./Auth/Login/Login";
import Register from "./Auth/Register/Register";
import { Home } from "./Pages/Home";

import { Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "./context/auth";


export const App = () =>{
  const { logout } = useAuth();
  const navigate = useNavigate();
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
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/login" element={<Login />} />
         <Route path="/register" element={<Register />} />
         <Route path="/dashboard" element={<div>Dashboard - Protected Route <button onClick={handleLogout}>Logout</button></div>} />
      </Routes>
    </>
  )
};
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../context/auth";

const Header: React.FC = () => {
  const { user, isLoggedIn, LogoutUser } = useAuth();

  const adminNavLinks = [
    { to: "/links", label: "Links" },
    { to: "/dashboard/auth/user/nox", label: "NOX" },
    { to: "/dashboard/auth/user/fiu", label: "FIU" },
    { to: "/dashboard/auth/user/facial", label: "Facial" },
    { to: "/dashboard/auth/user/int", label: "INT" },
    { to: "/dashboard/auth/user/ntoc", label: "NTOC" },
    { to: "/dashboard/auth/user/dossiers", label: "Dossiers" },
  ];

  return (
    <header className="bg-green-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">PSS System</h1>
          {isLoggedIn && user && (
            <span className="text-sm text-green-100">
              Logged in as {user.role}: {user.email}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <button
              onClick={LogoutUser}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
      {isLoggedIn && user?.role === "admin" && (
        <nav className="bg-green-700 border-t border-green-600">
          <div className="container mx-auto px-4 py-2">
            <ul className="flex space-x-6">
              {adminNavLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-white text-green-800"
                          : "text-white hover:bg-green-600"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useUser, useLogout } from "../../../Hook/Auth/useAuth";
import { Menu, X, Link as LinkIcon, FileText, Database, Camera, Search, File, Folder } from "lucide-react";

const Header: React.FC = () => {
  const { data: user, refetch: fetchUser } = useUser();
  const logoutMutation = useLogout();
  const isLoggedIn = !!user;

  const LogoutUser = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.log("Logout error", error);
    } finally {
      fetchUser();
    }
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: "/dashboard/auth/user/link", label: "Links", icon: LinkIcon },
    { to: "/dashboard/auth/user/nox", label: "NOX", icon: FileText },
    { to: "/dashboard/auth/user/fiu", label: "FIU", icon: Database },
    { to: "/dashboard/auth/user/facial", label: "Facial", icon: Camera },
    { to: "/dashboard/auth/user/int", label: "INT", icon: Search },
    { to: "/dashboard/auth/user/ntoc", label: "NTOC", icon: File },
    { to: "/dashboard/auth/user/dossiers", label: "Dossiers", icon: Folder },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-linear-to-r from-green-800 to-green-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">PSS System</h1>
          {isLoggedIn && user && (
            <span className="hidden md:block text-sm text-green-100">
              Logged in as {user.role}: {user.email}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {isLoggedIn && user && (
            <span className="md:hidden text-sm text-green-100">
              {user.role}
            </span>
          )}
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
          {isLoggedIn && (
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md hover:bg-green-600 transition-colors"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>
      {isLoggedIn && (
        <nav className="bg-green-700 border-t border-green-600">
          <div className="container mx-auto px-4 py-2">
            <ul className={`md:flex space-x-6 ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.to} className="mb-2 md:mb-0">
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-white text-green-800"
                            : "text-white hover:bg-green-600"
                        }`
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon size={16} className="mr-2" />
                      {link.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;

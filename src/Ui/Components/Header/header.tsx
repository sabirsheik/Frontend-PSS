/**
 * ============================================================
 * Application Header Component
 * ============================================================
 * 
 * Main navigation header for the PSS (Pakistan Surveillance Shield).
 * Displays the application logo, user info, navigation links,
 * and authentication controls.
 * 
 * Features:
 * - Responsive design with mobile hamburger menu
 * - Active navigation state indicators
 * - User role and email display
 * - Logout functionality with TanStack Query
 * - Professional gradient styling
 * 
 * @module Ui/Components/Header
 */

import React, { useState, useCallback, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";
import {
  Menu,
  X,
  Link as LinkIcon,
  FileText,
  Database,
  Camera,
  Search,
  File,
  Folder,
  LogOut,
  LogIn,
  Shield,
  User,
  ChevronDown,
} from "lucide-react";

// TanStack Query hooks
import { useUser, useLogout } from "../../../Hook/Auth/useAuth";

// ============================================================
// Types
// ============================================================

interface NavLinkItem {
  /** Route path */
  to: string;
  /** Display label */
  label: string;
  /** Lucide icon component */
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

// ============================================================
// Navigation Configuration
// ============================================================

/**
 * Main navigation links for authenticated users
 * These appear in the navigation bar below the header
 */
const NAV_LINKS: NavLinkItem[] = [
  { to: "/dashboard/auth/user/link", label: "Links", icon: LinkIcon },
  { to: "/dashboard/auth/user/nox", label: "NOX", icon: FileText },
  { to: "/dashboard/auth/user/fiu", label: "FIU", icon: Database },
  { to: "/dashboard/auth/user/facial", label: "Facial", icon: Camera },
  { to: "/dashboard/auth/user/int", label: "INT", icon: Search },
  { to: "/dashboard/auth/user/ntoc", label: "NTOC", icon: File },
  { to: "/dashboard/auth/user/dossiers", label: "Dossiers", icon: Folder },
] as const;

// ============================================================
// Component
// ============================================================

/**
 * Application Header Component
 * 
 * Renders the main navigation header with authentication controls
 */
export const Header: React.FC = () => {
  // ========================================
  // State
  // ========================================
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // ========================================
  // Hooks
  // ========================================
  const { data: user, refetch: fetchUser } = useUser();
  const logoutMutation = useLogout();

  // Derived state
  const isLoggedIn = !!user;

  // ========================================
  // Effects
  // ========================================

  /**
   * Handle clicks outside dropdowns to close them
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ========================================
  // Handlers
  // ========================================

  /**
   * Handle user logout
   * Clears session and refetches user data
   */
  const handleLogout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    } finally {
      fetchUser();
      setIsUserDropdownOpen(false);
    }
  }, [logoutMutation, fetchUser]);

  /**
   * Toggle mobile menu
   */
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  /**
   * Toggle user dropdown
   */
  const toggleUserDropdown = useCallback(() => {
    setIsUserDropdownOpen((prev) => !prev);
  }, []);

  /**
   * Close mobile menu (used when clicking nav links)
   */
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  /**
   * Get role badge color
   */
  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-amber-500/20 text-amber-200 border-amber-400/30";
      case "analyst":
        return "bg-blue-500/20 text-blue-200 border-blue-400/30";
      default:
        return "bg-gray-500/20 text-gray-200 border-gray-400/30";
    }
  };

  // ========================================
  // Render
  // ========================================
  return (
    <header className="bg-linear-to-r from-baseColor via-emerald-700 to-green-800 text-white shadow-xl">
      {/* Main Header Bar */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section: Logo & Brand */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold tracking-tight">PSS System</h1>
                <p className="text-xs text-emerald-200/80">Pakistan Surveillance Shield</p>
              </div>
            </NavLink>
          </div>

          {/* Right Section: User Info & Controls */}
          <div className="flex items-center gap-3">
            {isLoggedIn && user ? (
              <>
                {/* User Info - Desktop */}
                <div className="hidden md:flex items-center gap-3">
                  {/* Role Badge */}
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>

                  {/* User Dropdown */}
                  <div className="relative">
                    <button
                      onClick={toggleUserDropdown}
                      className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium max-w-32 truncate cursor-pointer">
                        {user.email}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isUserDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-xs text-gray-500">Signed in as</p>
                          <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
                        </div>
                        <NavLink
                          to="/dashboard/profile"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </NavLink>
                        <button
                          onClick={handleLogout}
                          disabled={logoutMutation.isPending}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          {logoutMutation.isPending ? "Logging out..." : "Logout"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Info - Mobile */}
                <div className="md:hidden relative" ref={profileRef}>
                  <button
                    onClick={toggleUserDropdown}
                    className="flex items-center gap-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors"
                    aria-label="User menu"
                  >
                    <User className="w-5 h-5" />
                    <ChevronDown className={`w-4 h-4 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Mobile User Dropdown */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Signed in as</p>
                        <p className="text-sm font-medium text-gray-800 truncate mt-1">{user.email}</p>
                        <span className={`inline-block mt-2 px-2 py-1 text-xs text-gray-800 font-medium rounded-full border ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                      <NavLink
                        to="/dashboard/profile"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile Settings
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        {logoutMutation.isPending ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden relative" ref={mobileMenuRef}>
                  <button
                    onClick={toggleMenu}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors"
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                  >
                    {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              </>
            ) : (
              /* Login Button - Not Logged In */
              <NavLink
                to="/login"
                className="flex items-center gap-2 px-4 py-2 bg-white text-baseColor font-medium rounded-lg hover:bg-emerald-50 transition-colors shadow-lg shadow-black/10"
              >
                <LogIn className="w-4 h-4" />
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Bar - Only visible when logged in */}
      {isLoggedIn && (
        <nav className="bg-linear-to-r from-emerald-800/50 via-green-800/50 to-emerald-900/50 border-t border-white/10">
          <div className="container mx-auto px-4">
            {/* Desktop Navigation */}
            <ul className="hidden md:flex flex-wrap gap-1 py-2">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-white text-baseColor shadow-lg transform scale-105"
                            : "text-white/90 hover:bg-white/10 hover:text-white hover:scale-105"
                        }`
                      }
                    >
                      <Icon size={16} />
                      {link.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>

            {/* Mobile Navigation */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <ul className="flex flex-col gap-1 py-3">
                {NAV_LINKS.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.to} style={{ animationDelay: `${index * 50}ms` }}>
                      <NavLink
                        to={link.to}
                        onClick={closeMenu}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 animate-fade-in ${
                            isActive
                              ? "bg-white text-baseColor shadow-lg"
                              : "text-white/90 hover:bg-white/10 hover:text-white"
                          }`
                        }
                      >
                        <Icon size={18} />
                        {link.label}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </nav>
      )}

      {/* Backdrop for dropdowns */}
      {(isUserDropdownOpen || isMenuOpen) && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => {
            setIsUserDropdownOpen(false);
            setIsMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};
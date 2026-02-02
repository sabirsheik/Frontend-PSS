/**
 * ============================================================
 * Login Page Component
 * ============================================================
 * 
 * Handles user authentication with username/email and password.
 * Uses TanStack Query for API calls with automatic loading
 * and error state management.
 * 
 * Features:
 * - Single identifier field (username or email)
 * - Form validation before submission
 * - Loading state during authentication
 * - Error display for failed attempts
 * - Automatic redirect after successful login
 * 
 * @module Ui/Pages/Auth/Login
 */

import { useState, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";

// TanStack Query hooks for authentication
import { useUser, useLogin } from "../../../../Hook/Auth/useAuth";

// UI Components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// ============================================================
// Type Definitions
// ============================================================

interface FormData {
  identifier: string;
  password: string;
}

interface FormErrors {
  identifier?: string;
  password?: string;
}

// ============================================================
// Component
// ============================================================

/**
 * Login Component
 * 
 * Renders a login form with email and password fields.
 * Handles form validation, submission, and navigation.
 */
export const Login = () => {
  // ========================================
  // State
  // ========================================
  const [formData, setFormData] = useState<FormData>({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
   const [showPassword, setShowPassword] = useState(false);

  // ========================================
  // Hooks
  // ========================================
  const navigate = useNavigate();
  
  // TanStack Query: Fetch user data after login
  const { refetch: fetchUser } = useUser();
  
  // TanStack Query: Login mutation with loading/error states
  const loginMutation = useLogin();

   const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // ========================================
  // Form Handlers
  // ========================================
  
  /**
   * Handle input field changes
   * Updates form data and clears field-specific errors
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      
      // Update form data
      setFormData((prev) => ({ ...prev, [name]: value }));
      
      // Clear error for the field being edited
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  /**
   * Validate form before submission
   * Returns true if form is valid
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Identifier validation (email or username)
    if (!formData.identifier.trim()) {
      newErrors.identifier = "Username or email is required";
    } else {
      // Check if it's a valid email or username
      const isEmail = /\S+@\S+\.\S+/.test(formData.identifier);
      const isUsername = /^[a-zA-Z0-9_]{3,30}$/.test(formData.identifier);
      
      if (!isEmail && !isUsername) {
        newErrors.identifier = "Please enter a valid username or email address";
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * Validates form, calls login API, and handles response
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submission
    if (!validateForm()) return;

    try {
      // Prepare data with trimmed identifier
      const loginData = {
        identifier: formData.identifier.trim(),
        password: formData.password,
      };

      // Call login mutation (TanStack Query handles loading state)
      const response = await loginMutation.mutateAsync(loginData);
      
      // Show success message
      toast.success(response.message || "Welcome back!");
      
      // Fetch user data to update context
      await fetchUser();
      
      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      // Error is automatically handled by TanStack Query
      // Show error toast
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Login failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  // ========================================
  // Render
  // ========================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 via-white to-teal-50 px-4 py-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-linear-to-br from-emerald-200 to-teal-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-linear-to-br from-teal-200 to-emerald-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-linear-to-r from-emerald-100 to-teal-100 rounded-full opacity-10 blur-3xl" />
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md shadow-2xl bg-white/90 backdrop-blur-xl border border-emerald-100/50 relative z-10">
        {/* Header */}
        <CardHeader className="space-y-3 text-center pb-2">
          {/* Logo/Icon */}
          <div className="mx-auto w-16 h-16 bg-linear-to-br from-baseColor to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mb-2">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          
          <CardTitle className="text-2xl font-bold text-gray-800">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-600">
            Logging in to your account to continue
          </CardDescription>
        </CardHeader>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {/* Identifier Field */}
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-gray-700 font-medium">
                Username or Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  placeholder="username or email@example.com"
                  value={formData.identifier}
                  onChange={handleInputChange}
                  className={`pl-10 h-11 ${errors.identifier ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  disabled={loginMutation.isPending}
                  autoComplete="username"
                />
              </div>
              {errors.identifier && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full" />
                  {errors.identifier}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                   type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`pl-10 h-11 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  disabled={loginMutation.isPending}
                  autoComplete="current-password"
                />
                 <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full" />
                  {errors.password}
                </p>
              )}
               {/* Forgot Password Link */}
            <div className="text-left">
              <NavLink
                to="/forget-password"
                className="text-sm text-baseColor hover:text-hoverColor hover:underline transition-colors"
              >
                Forgot password?
              </NavLink>
            </div>
            </div>

           
          </CardContent>

          <CardFooter className="flex flex-col gap-5 pt-2 mt-2">
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-11 bg-baseColor hover:bg-hoverColor text-white font-medium shadow-lg shadow-emerald-500/25 transition-all duration-200"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Login In
                </>
              )}
            </Button>

            <Separator className="my-1" />

            {/* Register Link */}
            <p className="text-center text-gray-600">
              Don't have an account?{" "}
              <NavLink
                to="/register"
                className="text-baseColor hover:text-hoverColor font-medium hover:underline transition-colors"
              >
                Create account
              </NavLink>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
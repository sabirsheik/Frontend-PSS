/**
 * ============================================================
 * User Registration Page Component
 * ============================================================
 * 
 * Handles new user registration with username, email and password.
 * After successful signup, user can directly log in.
 * 
 * Features:
 * - Username, email and password validation
 * - Username uniqueness checking
 * - Password strength requirements
 * - TanStack Query for API calls
 * - Professional UI with gradients and animations
 * 
 * @module Ui/Pages/Auth/Register
 */

import { useState, useCallback, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  Lock,
  UserPlus,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

// TanStack Query hooks
import { useSignup } from "../../../../Hook/Auth/useAuth";

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
// Types
// ============================================================

interface FormData {
  username: string;
  email: string;
  password: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
}

// ============================================================
// Password Validation Configuration
// ============================================================

/**
 * Password strength requirements
 * Each requirement has a pattern and label for display
 */
const PASSWORD_REQUIREMENTS = [
  { key: "length", label: "At least 8 characters", pattern: /.{8,}/ },
  { key: "letter", label: "Contains a letter", pattern: /[A-Za-z]/ },
  { key: "number", label: "Contains a number", pattern: /\d/ },
  { key: "special", label: "Contains a special character", pattern: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/ },
] as const;

// ============================================================
// Custom Hook: usePasswordStrength
// ============================================================

/**
 * Hook to calculate password strength based on requirements
 */
const usePasswordStrength = (password: string) => {
  const results = useMemo(() => {
    return PASSWORD_REQUIREMENTS.map((req) => ({
      ...req,
      met: req.pattern.test(password),
    }));
  }, [password]);

  const strength = useMemo(() => {
    const metCount = results.filter((r) => r.met).length;
    if (metCount === 0) return { level: 0, label: "Too weak", color: "bg-gray-200" };
    if (metCount === 1) return { level: 25, label: "Weak", color: "bg-red-500" };
    if (metCount === 2) return { level: 50, label: "Fair", color: "bg-amber-500" };
    if (metCount === 3) return { level: 75, label: "Good", color: "bg-emerald-400" };
    return { level: 100, label: "Strong", color: "bg-emerald-600" };
  }, [results]);

  const isValid = useMemo(() => {
    return results.every((r) => r.met);
  }, [results]);

  return { results, strength, isValid };
};

// ============================================================
// Component
// ============================================================

/**
 * User Registration Component
 * 
 * Renders the registration form with validation
 */
export const Register = () => {
  // ========================================
  // State
  // ========================================
  const [formData, setFormData] = useState<FormData>({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // ========================================
  // Hooks
  // ========================================
  const navigate = useNavigate();
  const signupMutation = useSignup();
  const { results: passwordChecks, strength, isValid: isPasswordValid } = usePasswordStrength(formData.password);

  // ========================================
  // Handlers
  // ========================================

  /**
   * Handle input field changes
   * Updates form data and clears field-specific errors
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      
      // Clear error when user starts typing
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  /**
   * Handle input blur for touched state
   */
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  /**
   * Validate the signup form
   * Returns true if form is valid, false otherwise
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (formData.username.length > 30) {
      newErrors.username = "Username must be at most 30 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!isPasswordValid) {
      newErrors.password = "Password does not meet all requirements";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isPasswordValid]);

  /**
   * Handle registration form submission
   */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    if (!validateForm()) return;

    // Prepare data with trimmed and lowercased email and username
    const signupData = {
      username: formData.username.trim().toLowerCase(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    // Submit signup request
    signupMutation.mutate(signupData, {
      onSuccess: (res) => {
        toast.success(res.message || "Registration successful!");
        navigate("/login");
      },
      onError: (err: Error) => {
        toast.error(err.message || "Registration failed. Please try again.");
      },
    });
  };

  // ========================================
  // Render Helpers
  // ========================================

  /**
   * Render password strength indicator
   */
  const renderPasswordStrength = () => {
    if (!formData.password || !touched.password) return null;

    return (
      <div className="space-y-3 mt-3">
        {/* Strength Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Password strength</span>
            <span className={`font-medium ${
              strength.level === 100 ? "text-emerald-600" :
              strength.level >= 75 ? "text-emerald-500" :
              strength.level >= 50 ? "text-amber-500" :
              "text-red-500"
            }`}>
              {strength.label}
            </span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${strength.color}`}
              style={{ width: `${strength.level}%` }}
            />
          </div>
        </div>

        {/* Requirements Checklist */}
        <div className="grid grid-cols-2 gap-1.5">
          {passwordChecks.map((check) => (
            <div
              key={check.key}
              className={`flex items-center gap-1.5 text-xs ${
                check.met ? "text-emerald-600" : "text-gray-400"
              }`}
            >
              {check.met ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              <span>{check.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ========================================
  // Render
  // ========================================
  return (
    <>
      {/* ================= REGISTRATION PAGE ================= */}
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 via-white to-green-50 px-4 py-8">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-baseColor/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl" />
        </div>

        {/* Main Card */}
        <Card className="relative w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl border border-emerald-100/50">
          {/* Header Section */}
          <CardHeader className="space-y-4 text-center pb-2">
            {/* Logo/Icon */}
            <div className="mx-auto w-16 h-16 bg-linear-to-br from-baseColor to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Shield className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Create your account
              </CardTitle>
              <CardDescription className="text-gray-500">
                Join PSS with secure email verification
              </CardDescription>
            </div>
          </CardHeader>

          {/* Form Section */}
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-5 pt-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4 text-gray-400" />
                  Username
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="your_username"
                    value={formData.username}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={signupMutation.isPending}
                    className={`h-11 pl-4 pr-4 ${
                      errors.username
                        ? "border-red-500 focus-visible:ring-red-500"
                        : touched.username && formData.username && !errors.username
                        ? "border-emerald-500 focus-visible:ring-emerald-500"
                        : ""
                    }`}
                  />
                  {touched.username && formData.username && !errors.username && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                  )}
                </div>
                {errors.username && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-gray-400" />
                  Email address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@domain.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={signupMutation.isPending}
                    className={`h-11 pl-4 pr-4 ${
                      errors.email
                        ? "border-red-500 focus-visible:ring-red-500"
                        : touched.email && formData.email && !errors.email
                        ? "border-emerald-500 focus-visible:ring-emerald-500"
                        : ""
                    }`}
                  />
                  {touched.email && formData.email && !errors.email && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                  )}
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-gray-400" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={signupMutation.isPending}
                    className={`h-11 pl-4 pr-12 ${
                      errors.password
                        ? "border-red-500 focus-visible:ring-red-500"
                        : touched.password && isPasswordValid
                        ? "border-emerald-500 focus-visible:ring-emerald-500"
                        : ""
                    }`}
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
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.password}
                  </p>
                )}
                
                {/* Password Strength Indicator */}
                {renderPasswordStrength()}
              </div>
            </CardContent>

            {/* Footer Section */}
            <CardFooter className="flex flex-col gap-4 pt-2">
              {/* Submit Button */}
              <Button
                type="submit"
                disabled={signupMutation.isPending}
                className="w-full h-11 bg-baseColor hover:bg-hoverColor text-white font-medium shadow-lg shadow-emerald-500/25 transition-all"
              >
                {signupMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create Account
                  </>
                )}
              </Button>

              <Separator />

              {/* Login Link */}
              <p className="text-sm text-gray-500 text-center">
                Already have an account?{" "}
                <NavLink
                  to="/login"
                  className="font-medium text-baseColor hover:text-hoverColor hover:underline transition-colors"
                >
                  Sign in
                </NavLink>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
};
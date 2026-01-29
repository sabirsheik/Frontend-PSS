/**
 * ============================================================
 * Reset Password Page Component
 * ============================================================
 * 
 * Allows users to set a new password after OTP verification.
 * Users arrive here from the OTPVerifyModal with their email
 * passed via location state.
 * 
 * Features:
 * - Password strength validation with visual feedback
 * - Password confirmation matching
 * - Eye toggle for password visibility
 * - Professional UI with gradients
 * - TanStack Query for API calls
 * 
 * @module Ui/Pages/Auth/ResetPassword
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { toast } from "sonner";
import {
  Loader2,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

// TanStack Query hook
import { useResetPassword } from "../../../../Hook/Auth/useAuth";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

// ============================================================
// Types
// ============================================================

interface FormData {
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  newPassword?: string;
  confirmPassword?: string;
}

// ============================================================
// Password Validation Configuration
// ============================================================

/**
 * Password strength requirements
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

  const isValid = useMemo(() => results.every((r) => r.met), [results]);

  return { results, strength, isValid };
};

// ============================================================
// Component
// ============================================================

/**
 * Reset Password Component
 * 
 * Renders the password reset form with validation
 */
export const ResetPassword = () => {
  // ========================================
  // State
  // ========================================
  const [formData, setFormData] = useState<FormData>({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // ========================================
  // Hooks
  // ========================================
  const navigate = useNavigate();
  const location = useLocation();
  const resetPasswordMutation = useResetPassword();
  
  // Get email from location state (passed from OTP verification)
  const email = location.state?.email as string | undefined;
  
  // Password strength hook
  const { results: passwordChecks, strength, isValid: isPasswordValid } = usePasswordStrength(formData.newPassword);

  // ========================================
  // Effects
  // ========================================

  /**
   * Redirect to login if no email is provided
   */
  useEffect(() => {
    if (!email) {
      toast.error("Session expired. Please start the password reset process again.");
      navigate("/login");
    }
  }, [email, navigate]);

  // ========================================
  // Computed Values
  // ========================================

  /**
   * Check if passwords match
   */
  const passwordsMatch = formData.newPassword === formData.confirmPassword && formData.confirmPassword.length > 0;

  // ========================================
  // Handlers
  // ========================================

  /**
   * Handle input field changes
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      
      // Clear error on input
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
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  }, []);

  /**
   * Toggle new password visibility
   */
  const toggleNewPasswordVisibility = useCallback(() => {
    setShowNewPassword((prev) => !prev);
  }, []);

  /**
   * Toggle confirm password visibility
   */
  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  /**
   * Validate the form
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // New password validation
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (!isPasswordValid) {
      newErrors.newPassword = "Password does not meet all requirements";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isPasswordValid]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    resetPasswordMutation.mutate(
      { email: email!, newPassword: formData.newPassword },
      {
        onSuccess: () => {
          toast.success("Password reset successful! Please login with your new password.");
          navigate("/login");
        },
        onError: (err: Error) => {
          toast.error(err.message || "Password reset failed. Please try again.");
        },
      }
    );
  };

  // ========================================
  // Render: Password Strength Indicator
  // ========================================

  const renderPasswordStrength = () => {
    if (!formData.newPassword || !touched.newPassword) return null;

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
  // Render: Guard for missing email
  // ========================================
  if (!email) {
    return null; // Render nothing while redirecting
  }

  // ========================================
  // Render: Main Component
  // ========================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 via-white to-green-50 px-4 py-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-baseColor/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl" />
      </div>

      {/* Main Card */}
      <Card className="relative w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl border border-emerald-100/50">
        {/* Header */}
        <CardHeader className="space-y-4 text-center pb-2">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-linear-to-br from-baseColor to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <KeyRound className="w-8 h-8 text-white" />
          </div>

          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Reset Password
            </CardTitle>
            <CardDescription className="text-gray-500">
              Create a strong new password for your account
            </CardDescription>
          </div>

          {/* Email indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-emerald-700 font-medium">{email}</span>
          </div>
        </CardHeader>

        <Separator />

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 pt-5">
            {/* New Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="newPassword"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Lock className="w-4 h-4 text-gray-400" />
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={resetPasswordMutation.isPending}
                  className={`h-11 pl-4 pr-12 ${
                    errors.newPassword
                      ? "border-red-500 focus-visible:ring-red-500"
                      : touched.newPassword && isPasswordValid
                      ? "border-emerald-500 focus-visible:ring-emerald-500"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={toggleNewPasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.newPassword}
                </p>
              )}
              
              {/* Password Strength Indicator */}
              {renderPasswordStrength()}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Lock className="w-4 h-4 text-gray-400" />
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  disabled={resetPasswordMutation.isPending}
                  className={`h-11 pl-4 pr-12 ${
                    errors.confirmPassword
                      ? "border-red-500 focus-visible:ring-red-500"
                      : touched.confirmPassword && passwordsMatch
                      ? "border-emerald-500 focus-visible:ring-emerald-500"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              
              {/* Match indicator */}
              {touched.confirmPassword && formData.confirmPassword && (
                <p className={`text-xs flex items-center gap-1 ${
                  passwordsMatch ? "text-emerald-600" : "text-red-600"
                }`}>
                  {passwordsMatch ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Passwords match
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      Passwords do not match
                    </>
                  )}
                </p>
              )}
              
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-2">
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={resetPasswordMutation.isPending}
              className="w-full h-11 bg-baseColor hover:bg-hoverColor text-white font-medium shadow-lg shadow-emerald-500/25 transition-all"
            >
              {resetPasswordMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  Reset Password
                </>
              )}
            </Button>

            <Separator />

            {/* Back to Login */}
            <NavLink
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-baseColor transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </NavLink>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
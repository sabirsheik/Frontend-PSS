/**
 * ============================================================
 * Forgot Password Modal Component
 * ============================================================
 * 
 * Handles the password recovery flow. Users enter their username
 * or email to check if it exists in the database, then navigate
 * to reset password page.
 * 
 * Flow:
 * 1. User enters username or email
 * 2. Account existence checked in database
 * 3. Navigate to reset password page with user's email
 * 
 * @module Ui/Pages/Auth/ForgetPasswordModal
 */

import { useState, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  KeyRound,
  Send,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";

// TanStack Query hook
import { useForgetPassword } from "../../../../Hook/Auth/useAuth";

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
import { Checkbox } from "@/components/ui/checkbox";

// ============================================================
// Component
// ============================================================

/**
 * Forgot Password Modal
 * 
 * Renders a modal for initiating password recovery
 */
export const ForgetPasswordModal = () => {
  // ========================================
  // State
  // ========================================
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [touched, setTouched] = useState(false);

  // ========================================
  // Hooks
  // ========================================
  const navigate = useNavigate();
  const forgetPasswordMutation = useForgetPassword();

  // ========================================
  // Validation
  // ========================================

  /**
   * Check if identifier is valid (email or username)
   */
  const isIdentifierValid = (() => {
    if (!identifier.trim()) return false;
    // Check if it's an email or a valid username
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const isUsername = /^[a-zA-Z0-9_]{3,30}$/.test(identifier);
    return isEmail || isUsername;
  })();

  // ========================================
  // Handlers
  // ========================================

  /**
   * Handle identifier input change
   */
  const handleIdentifierChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIdentifier(e.target.value);
      setError(""); // Clear error on input
    },
    []
  );

  /**
   * Handle identifier input blur
   */
  const handleBlur = useCallback(() => {
    setTouched(true);
  }, []);

  /**
   * Handle checkbox change
   */
  const handleConfirmChange = useCallback((checked: boolean) => {
    setIsConfirmed(checked);
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Trim identifier
    const trimmedIdentifier = identifier.trim();

    // Validate identifier
    if (!trimmedIdentifier) {
      setError("Please enter your username or email address");
      return;
    }

    if (!isIdentifierValid) {
      setError("Please enter a valid username or email address");
      return;
    }

    if (!isConfirmed) {
      setError("Please confirm that this account belongs to you");
      return;
    }

    // Submit forgot password request with trimmed identifier
    forgetPasswordMutation.mutate(
      { identifier: trimmedIdentifier },
      {
        onSuccess: (res) => {
          toast.success(res.message || "Account verified successfully. Redirecting to password reset.");
          navigate("/reset-password", { state: { email: res.email } });
        },
        onError: (err: Error) => {
          const errorMessage = err.message || "Failed to verify email. Please try again.";
          setError(errorMessage);
          toast.error(errorMessage);
        },
      }
    );
  };





  // ========================================
  // Render: Forgot Password Form
  // ========================================
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-60 h-60 bg-baseColor/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-60 h-60 bg-emerald-300/10 rounded-full blur-3xl" />
      </div>

      {/* Main Card */}
      <Card className="relative w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl border border-emerald-100/50 animate-in fade-in zoom-in-95 duration-300">
        {/* Close Button */}
        <NavLink
          to="/login"
          className="absolute right-4 top-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </NavLink>

        {/* Header */}
        <CardHeader className="text-center space-y-4 pt-8">
          {/* Icon */}
          <div className="mx-auto w-14 h-14 bg-linear-to-br from-baseColor to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <KeyRound className="w-7 h-7 text-white" />
          </div>

          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-gray-800">
              Forgot Password?
            </CardTitle>
            <CardDescription className="text-gray-500">
              Enter your username or email to verify your account
            </CardDescription>
          </div>
        </CardHeader>

        <Separator />

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 pt-5">
            {/* Identifier Field */}
            <div className="space-y-2">
              <Label
                htmlFor="identifier"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-gray-400" />
                Username or Email
              </Label>
              <div className="relative">
                <Input
                  id="identifier"
                  type="text"
                  placeholder="username or email@example.com"
                  value={identifier}
                  onChange={handleIdentifierChange}
                  onBlur={handleBlur}
                  disabled={forgetPasswordMutation.isPending}
                  className={`h-11 pl-4 pr-4 ${
                    error
                      ? "border-red-500 focus-visible:ring-red-500"
                      : touched && isIdentifierValid
                      ? "border-emerald-500 focus-visible:ring-emerald-500"
                      : ""
                  }`}
                />
                {touched && identifier && (
                  isIdentifierValid ? (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                  ) : (
                    <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                  )
                )}
              </div>
              {error && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {error}
                </p>
              )}
            </div>

            {/* Confirmation Checkbox */}
            <div className="flex items-start gap-3 p-3 bg-gray-50/80 rounded-lg border border-gray-100">
              <Checkbox
                id="confirm"
                checked={isConfirmed}
                onCheckedChange={handleConfirmChange}
                className="mt-0.5 data-[state=checked]:bg-baseColor data-[state=checked]:border-baseColor"
              />
              <Label
                htmlFor="confirm"
                className="text-sm text-gray-600 leading-snug cursor-pointer"
              >
                I confirm this account belongs to me and I have access to it
              </Label>
            </div>

            {/* Info Box */}
            <div className="p-3 bg-emerald-50/80 rounded-lg border border-emerald-100/50">
              <p className="text-xs text-emerald-700">
                💡 Your username or email will be verified against our database.
                If valid, you'll be redirected to reset your password.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-2">
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={forgetPasswordMutation.isPending || !identifier || !isConfirmed}
              className="w-full h-11 bg-baseColor hover:bg-hoverColor text-white font-medium shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
            >
              {forgetPasswordMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Verifying account...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Verify Account
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
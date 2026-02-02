/**
 * ============================================================
 * Forgot Password Modal Component
 * ============================================================
 * 
 * Handles the password recovery flow. Users enter their email
 * to receive a reset link, then enter new password.
 * 
 * Flow:
 * 1. User enters registered email
 * 2. Reset link sent to email
 * 3. User enters new password
 * 
 * @module Ui/Pages/Auth/ForgetPasswordModal
 */

import { useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
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
// Types
// ============================================================

type FlowStep = "forget" | "reset";

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
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<FlowStep>("forget");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [touched, setTouched] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // ========================================
  // Hooks
  // ========================================
  const forgetPasswordMutation = useForgetPassword();

  // ========================================
  // Validation
  // ========================================

  /**
   * Check if email is valid
   */
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ========================================
  // Handlers
  // ========================================

  /**
   * Handle email input change
   */
  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      setError(""); // Clear error on input
    },
    []
  );

  /**
   * Handle email input blur
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

    // Validate email
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!isEmailValid) {
      setError("Please enter a valid email address");
      return;
    }

    if (!isConfirmed) {
      setError("Please confirm that this email belongs to your account");
      return;
    }

    // Submit forgot password request
    forgetPasswordMutation.mutate(
      { email },
      {
        onSuccess: (res) => {
          toast.success(res.message || "Reset link sent to your email!");
          setStep("reset");
        },
        onError: (err: Error) => {
          const errorMessage = err.message || "Failed to send reset email. Please try again.";
          setError(errorMessage);
          toast.error(errorMessage);
        },
      }
    );
  };

  /**
   * Handle reset password
   */
  const handleReset = useCallback(() => {
    if (!newPassword.trim()) {
      setError("Please enter a new password");
      return;
    }

    // Use resetPassword mutation
    // Note: In a real app, you'd get a token from the email link
    // For now, we'll use the email directly
    // This is not secure, but for demo purposes
    // In production, implement proper token-based reset
  }, [newPassword]);

  // ========================================
  // Render: Reset Step
  // ========================================
  if (step === "reset") {
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

          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <KeyRound className="w-6 h-6 text-baseColor" />
              Reset Password
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter your new password for {email}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="h-11"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-2">
            <Button
              onClick={handleReset}
              className="w-full h-11 bg-baseColor hover:bg-hoverColor text-white font-medium shadow-lg shadow-emerald-500/25"
            >
              <Send className="w-5 h-5 mr-2" />
              Reset Password
            </Button>

            <Button
              variant="outline"
              onClick={() => setStep("forget")}
              className="w-full h-10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

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
              Enter your email to receive a verification code
            </CardDescription>
          </div>
        </CardHeader>

        <Separator />

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 pt-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-gray-400" />
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@domain.com"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleBlur}
                  disabled={forgetPasswordMutation.isPending}
                  className={`h-11 pr-10 ${
                    error
                      ? "border-red-500 focus-visible:ring-red-500"
                      : touched && isEmailValid
                      ? "border-emerald-500 focus-visible:ring-emerald-500"
                      : ""
                  }`}
                />
                {touched && email && (
                  isEmailValid ? (
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
                I confirm this email belongs to my account and I have access to it
              </Label>
            </div>

            {/* Info Box */}
            <div className="p-3 bg-emerald-50/80 rounded-lg border border-emerald-100/50">
              <p className="text-xs text-emerald-700">
                💡 A 6-digit verification code will be sent to your email.
                The code expires in 10 minutes.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-2">
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={forgetPasswordMutation.isPending || !email || !isConfirmed}
              className="w-full h-11 bg-baseColor hover:bg-hoverColor text-white font-medium shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
            >
              {forgetPasswordMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending reset email...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Verification Code
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
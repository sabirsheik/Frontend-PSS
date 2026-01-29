/**
 * ============================================================
 * Forgot Password Modal Component
 * ============================================================
 * 
 * Handles the password recovery flow. Users enter their email
 * to receive an OTP, which is then verified before allowing
 * password reset.
 * 
 * Flow:
 * 1. User enters registered email
 * 2. OTP is sent to email
 * 3. OTPVerifyModal handles verification
 * 4. User is redirected to reset password page
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

// OTP Verification Modal
import { OTPVerifyModal } from "../OtpVerify/OTPVerifyModal";

// ============================================================
// Types
// ============================================================

type FlowStep = "forget" | "otp";

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

    // Trim and lowercase email
    const trimmedEmail = email.trim().toLowerCase();

    // Validate email
    if (!trimmedEmail) {
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

    // Submit forgot password request with trimmed/lowercased email
    forgetPasswordMutation.mutate(
      { email: trimmedEmail },
      {
        onSuccess: (res) => {
          toast.success(res.message || "OTP sent to your email!");
          setStep("otp");
        },
        onError: (err: Error) => {
          const errorMessage = err.message || "Failed to send OTP. Please try again.";
          setError(errorMessage);
          toast.error(errorMessage);
        },
      }
    );
  };

  /**
   * Handle OTP modal close (go back to email step)
   */
  const handleOtpClose = useCallback(() => {
    setStep("forget");
  }, []);

  // ========================================
  // Render: OTP Step
  // ========================================
  if (step === "otp") {
    return (
      <OTPVerifyModal
        email={email}
        onClose={handleOtpClose}
        redirectPath="/reset-password"
        purpose="password-reset"
      />
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
                  Sending OTP...
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
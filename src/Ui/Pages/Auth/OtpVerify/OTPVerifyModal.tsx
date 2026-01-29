/**
 * ============================================================
 * OTP Verification Modal Component
 * ============================================================
 * 
 * A professional OTP verification dialog with a 10-minute countdown
 * timer. Used for email verification during signup and password reset.
 * 
 * Features:
 * - 10-minute countdown timer with visual indicator
 * - Auto-disable on expiry
 * - Resend OTP functionality (if needed)
 * - Clean, accessible UI
 * - TanStack Query for API calls
 * 
 * @module Ui/Pages/Auth/OtpVerify
 */

import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

// TanStack Query hooks
import { useVerifyOtp } from "../../../../Hook/Auth/useAuth";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// ============================================================
// Configuration
// ============================================================

/**
 * OTP Timer Configuration
 * 10 minutes = 600 seconds
 */
const OTP_TIMER_CONFIG = {
  /** Total duration in seconds (10 minutes) */
  DURATION_SECONDS: 10 * 60,
  
  /** Warning threshold in seconds (1 minute remaining) */
  WARNING_THRESHOLD: 60,
  
  /** Critical threshold in seconds (30 seconds remaining) */
  CRITICAL_THRESHOLD: 30,
} as const;

// ============================================================
// Types
// ============================================================

interface OTPVerifyModalProps {
  /** User's email address for OTP verification */
  email: string;
  
  /** Callback function when modal is closed */
  onClose: () => void;
  
  /** Optional: Custom redirect path after verification */
  redirectPath?: string;
  
  /** Optional: Purpose of OTP verification */
  purpose?: "signup" | "password-reset";
}

// ============================================================
// Custom Hook: useOTPTimer
// ============================================================

/**
 * Custom hook for managing OTP countdown timer
 * 
 * @param {number} initialSeconds - Starting time in seconds
 * @returns Timer state and control functions
 */
const useOTPTimer = (initialSeconds: number) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isExpired, setIsExpired] = useState(false);

  // Timer effect
  useEffect(() => {
    // Check if already expired
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    // Set up interval for countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Reset timer function
  const resetTimer = useCallback(() => {
    setTimeLeft(initialSeconds);
    setIsExpired(false);
  }, [initialSeconds]);

  // Format time as MM:SS
  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, [timeLeft]);

  // Determine timer status for styling
  const timerStatus = useMemo(() => {
    if (isExpired) return "expired";
    if (timeLeft <= OTP_TIMER_CONFIG.CRITICAL_THRESHOLD) return "critical";
    if (timeLeft <= OTP_TIMER_CONFIG.WARNING_THRESHOLD) return "warning";
    return "normal";
  }, [timeLeft, isExpired]);

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    return (timeLeft / initialSeconds) * 100;
  }, [timeLeft, initialSeconds]);

  return {
    timeLeft,
    isExpired,
    formattedTime,
    timerStatus,
    progressPercentage,
    resetTimer,
  };
};

// ============================================================
// Component
// ============================================================

/**
 * OTP Verification Modal
 * 
 * Renders a modal dialog for OTP input with a countdown timer.
 * Automatically handles expiry and navigation.
 */
export const OTPVerifyModal = ({
  email,
  onClose,
  redirectPath = "/reset-password",
  purpose = "password-reset",
}: OTPVerifyModalProps) => {
  // ========================================
  // State
  // ========================================
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  // ========================================
  // Hooks
  // ========================================
  const navigate = useNavigate();
  
  // TanStack Query mutation for OTP verification
  const verifyOtpMutation = useVerifyOtp();
  
  // Custom timer hook
  const {
    formattedTime,
    isExpired,
    timerStatus,
    progressPercentage,
  } = useOTPTimer(OTP_TIMER_CONFIG.DURATION_SECONDS);

  // ========================================
  // Effects
  // ========================================
  
  /**
   * Handle timer expiry
   * Shows error toast and closes modal
   */
  useEffect(() => {
    if (isExpired) {
      toast.error("OTP has expired. Please request a new one.");
      // Small delay before closing to show the message
      const timeout = setTimeout(() => {
        onClose();
        navigate("/login");
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [isExpired, onClose, navigate]);

  // ========================================
  // Handlers
  // ========================================

  /**
   * Handle OTP input change
   * Only allows numeric input up to 6 digits
   */
  const handleOtpChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, "").slice(0, 6);
      setOtp(value);
      setError(""); // Clear error on input change
    },
    []
  );

  /**
   * Handle OTP verification submission
   */
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate OTP
    if (!otp) {
      setError("Please enter the OTP code");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be exactly 6 digits");
      return;
    }

    // Prevent submission if expired
    if (isExpired) {
      toast.error("OTP has expired. Please request a new one.");
      return;
    }

    // Call verification API
    verifyOtpMutation.mutate(
      { email, otp },
      {
        onSuccess: () => {
          toast.success("OTP verified successfully!");
          
          // Navigate based on purpose
          if (purpose === "password-reset") {
            navigate(redirectPath, { state: { email } });
          } else {
            navigate("/login");
          }
        },
        onError: (err: Error) => {
          const errorMessage = err.message || "Invalid OTP. Please try again.";
          setError(errorMessage);
          toast.error(errorMessage);
        },
      }
    );
  };

  /**
   * Get timer color based on status
   */
  const getTimerColor = () => {
    switch (timerStatus) {
      case "critical":
        return "text-red-600";
      case "warning":
        return "text-amber-600";
      case "expired":
        return "text-red-600";
      default:
        return "text-baseColor";
    }
  };

  /**
   * Get progress bar color based on status
   */
  const getProgressColor = () => {
    switch (timerStatus) {
      case "critical":
        return "bg-red-500";
      case "warning":
        return "bg-amber-500";
      case "expired":
        return "bg-red-500";
      default:
        return "bg-baseColor";
    }
  };

  // ========================================
  // Render
  // ========================================
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl shadow-2xl border border-emerald-100/50">
        {/* Header */}
        <DialogHeader className="text-center space-y-3">
          {/* Icon */}
          <div className="mx-auto w-14 h-14 bg-linear-to-br from-baseColor to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          
          <DialogTitle className="text-xl font-bold text-gray-800">
            Verify Your Email
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Enter the 6-digit code sent to{" "}
            <span className="font-medium text-gray-800">{email}</span>
          </DialogDescription>
        </DialogHeader>

        <Separator />

        {/* Timer Section */}
        <div className="space-y-3">
          {/* Timer Display */}
          <div className="flex items-center justify-center gap-2">
            <Clock className={`w-5 h-5 ${getTimerColor()}`} />
            <span className={`text-2xl font-mono font-bold ${getTimerColor()}`}>
              {formattedTime}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${getProgressColor()}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Status Message */}
          <p className={`text-center text-sm ${getTimerColor()}`}>
            {isExpired ? (
              <span className="flex items-center justify-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Code expired. Please request a new one.
              </span>
            ) : timerStatus === "critical" ? (
              <span className="flex items-center justify-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Hurry! Code expires soon
              </span>
            ) : timerStatus === "warning" ? (
              "Less than 1 minute remaining"
            ) : (
              "Code expires in 10 minutes"
            )}
          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          {/* OTP Input */}
          <div className="space-y-2">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="• • • • • •"
              maxLength={6}
              value={otp}
              onChange={handleOtpChange}
              disabled={verifyOtpMutation.isPending || isExpired}
              className={`text-center text-2xl tracking-[0.5em] font-bold h-14 ${
                error ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-600 text-center flex items-center justify-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={verifyOtpMutation.isPending || isExpired || otp.length !== 6}
            className="w-full h-11 bg-baseColor hover:bg-hoverColor text-white font-medium shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
          >
            {verifyOtpMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Verifying...
              </>
            ) : isExpired ? (
              <>
                <AlertCircle className="w-5 h-5 mr-2" />
                Code Expired
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Verify Code
              </>
            )}
          </Button>
        </form>

        <Separator />

        {/* Footer Actions */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-500">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={onClose}
              className="text-baseColor hover:text-hoverColor font-medium hover:underline transition-colors"
            >
              Try again
            </button>
          </p>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
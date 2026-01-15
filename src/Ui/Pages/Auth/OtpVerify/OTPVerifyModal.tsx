import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
// Hook to verify OTP
import { useVerifyOtp } from "../../../../Hook/Auth/useAuth";

// Props interface
interface Props {
  email: string;
  onClose: () => void;
}

export const OTPVerifyModal = ({ email, onClose }: Props) => {
  // State variables
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(30); // 30 sec timer
  const navigate = useNavigate();
  // Hook for OTP verification mutation
  const verifyOtpMutation = useVerifyOtp();

  /* ================= TIMER ================= */
  useEffect(() => {
    // If time is up, show error and close modal
    if (timeLeft <= 0) {
      toast.error("OTP expired");
      onClose(); // modal hide
      navigate("/login"); // redirect to login
      return;
    }
    // Set interval to decrease time left every second
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    // Cleanup interval on unmount or timeLeft change
    return () => clearInterval(timer);
  }, [timeLeft, onClose, navigate]);

  /* ================= VERIFY ================= */
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    // === VALIDATION === //
    if (!otp) {
      toast.warning("Enter OTP");
      return;
    }
    //  === API CALL === //
    verifyOtpMutation.mutate(
      { email, otp },
      {
        // Callbacks for mutation result
        onSuccess: () => {
          // On success, show success message
          toast.success("OTP verified");

          // Navigate to ResetPassword route with email state
          navigate("/reset-password", { state: { email } });
        },
        // On error, show error message
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Invalid OTP");
        },
      }
    );
  };
  //  Calculate minutes and seconds for timer display
  const minutes = Math.floor(timeLeft / 60);
  // Calculate remaining seconds
  const seconds = timeLeft % 60;

  return (
    // OTP Verification Dialog
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm bg-white/90 backdrop-blur-xl shadow-2xl border border-muted/40">
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-xl font-semibold text-baseColor">
            Verify OTP
          </DialogTitle>
          <DialogDescription className="text-sm">
            Enter the 6-digit code sent to your email
          </DialogDescription>
        </DialogHeader>

        <Separator />

        {/* Timer */}
        <div className="text-center text-sm font-medium text-muted-foreground mt-2">
          Time Remaining{" "}
          <span className="text-baseColor">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>

        {/* OTP FORM */}
        <form onSubmit={handleVerify} className="space-y-4 mt-4">
          <Input
            type="text"
            placeholder="••••••"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="text-center tracking-[0.35em] text-lg font-semibold"
          />
          {/* if VerifyingMutation is pending button disabled */}
          <Button
            disabled={verifyOtpMutation.isPending}
            className="w-full bg-baseColor hover:bg-hoverColor text-white"
          >
            {/* Button text changes based on mutation state */}
            {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
        {/*  */}
        <Separator />
        {/* Footer Actions */}
        <div className="text-center text-sm mt-2">
          <button
            type="button"
            onClick={onClose}
            className="block mx-auto text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
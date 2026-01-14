import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useVerifyOtp } from "../../../../Hook/Auth/useAuth";
import ResetPasswordModal from "../ResetPasswordModal/ResetPasswordModal";

interface Props {
  email: string;
  onClose: () => void;
  onVerified: () => void;
}

const OTPVerifyModal = ({ email, onClose, onVerified }: Props) => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); 
  const [showReset, setShowReset] = useState(false); 

  const verifyOtpMutation = useVerifyOtp();

  // Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      toast.error("OTP expired");
      onClose();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onClose]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      toast.warning("Enter OTP");
      return;
    }

    verifyOtpMutation.mutate(
      { email, otp },
      {
        onSuccess: () => {
          toast.success("OTP verified");
          onVerified();
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Invalid OTP");
        },
      }
    );
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (showReset) {
    return <ResetPasswordModal email={email} onClose={() => setShowReset(false)} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl font-bold"
        >
          ×
        </button>
        <h2 className="text-lg font-semibold text-center mb-2">
          Verify OTP
        </h2>

        <p className="text-center text-sm mb-4">
          Time Left: {minutes}:{seconds.toString().padStart(2, "0")}
        </p>
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full px-4 py-2 border rounded"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button
            disabled={verifyOtpMutation.isPending}
            className={`w-full py-2 text-white rounded ${
              verifyOtpMutation.isPending ? "bg-green-600" : "bg-green-700 hover:bg-green-800"
            }`}
          >
            {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerifyModal;
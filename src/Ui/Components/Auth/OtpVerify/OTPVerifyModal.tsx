import { useEffect, useState } from "react";
import axios from "../../../../Hook/api/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Props {
  email: string;
  onClose: () => void;
}

const OTPVerifyModal = ({ email, onClose }: Props) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  const navigate = useNavigate();

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

    try {
      setLoading(true);
      console.log(email, otp);

      const response = await axios.post("/api/auth/verifyOtp", {
        email,
        otp,
      });
      if (response.status === 200){
        toast.success("OTP verified");
      }else{
        toast.error("Invalid OTP");
      }

      onClose();
      navigate("/reset-password", { state: { email } });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

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
            disabled={loading}
            className={`w-full py-2 text-white rounded ${
              loading ? "bg-green-600" : "bg-green-700 hover:bg-green-800"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
      </div>
    </div>
  );
};
export default OTPVerifyModal;
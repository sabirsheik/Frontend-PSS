import { useState } from "react";
import axios from "../../../../Hook/api/axios";
import { toast } from "sonner";
import OTPVerifyModal from "../OtpVerify/OTPVerifyModal";
import { NavLink } from "react-router-dom";

import { Button } from "@/components/ui/button";

const ForgetPasswordModal = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.warning("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/auth/forget-password", { email });

      toast.success(res.data.message || "OTP sent");

      // Open OTP modal
      setShowOTPModal(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
          <div className="container relative text-red-900">
          <NavLink to="/login" className="text-center text-lg absolute right-2 top-[-6] text-gray-500 hover:text-gray-700">
           ×
          </NavLink>
          </div>
          <h2 className="text-xl font-semibold text-center mb-4">
            Forgot Password
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 mb-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input type="checkbox" required className="mb-3"/>
            <Button
              disabled={loading}
              className={`w-full py-2 text-white rounded ${
                loading ? "bg-green-600" : "bg-green-700 hover:bg-green-800"
              }`}
            >
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </form>
        </div>
      </div>

      {/* OTP Modal */}
      {showOTPModal && (
        <OTPVerifyModal
          email={email}
          onClose={() => setShowOTPModal(false)}
        />
      )}
    </>
  );
};

export default ForgetPasswordModal;

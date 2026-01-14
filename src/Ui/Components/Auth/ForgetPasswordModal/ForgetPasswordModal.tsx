import { useState } from "react";
import { useForgetPassword } from "../../../../Hook/Auth/useForgetPassword";
import { toast } from "sonner";
import { useNavigate, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgetPasswordModal() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const forgetPasswordMutation = useForgetPassword();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    try {
      const res = await forgetPasswordMutation.mutateAsync({ email });
      toast.success(res.message || "OTP sent");

      // Navigate to reset password with email
      navigate("/reset-password", { state: { email } });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to send OTP";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm bg-black/20">
        <div className="w-full max-w-md p-8 bg-white/90 backdrop-blur-xl rounded-lg shadow-2xl border-0 relative">
          <div className="container relative text-red-900">
          <NavLink to="/login" className="text-center text-lg absolute right-2 top-[-6] text-gray-500 hover:text-gray-700">
           ×
          </NavLink>
          </div>
          <h2 className="text-xl font-semibold text-center mb-4">
            Forgot Password
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 mb-2 border rounded-lg bg-white/50 backdrop-blur-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && (
                <p className="text-sm text-red-600 mb-2">{error}</p>
              )}
            </div>
            <input type="checkbox" required className="mb-3"/>
            <Button
              disabled={forgetPasswordMutation.isPending}
              className={`w-full py-2 text-white rounded-lg ${
                forgetPasswordMutation.isPending ? "bg-green-600" : "bg-green-700 hover:bg-green-800"
              }`}
            >
              {forgetPasswordMutation.isPending ? "Sending..." : "Send OTP"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

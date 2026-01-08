import { useState } from "react";
import axios from "../../../../Hook/api/axios";
import { useNavigate, Link, NavLink } from "react-router-dom";

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
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const passwordRegex =
    /^(?=(?:.*[A-Za-z]){2,})(?=(?:.*\d){2,})(?=(?:.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]){2,}).{6,}$/;

  // REGISTER
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!passwordRegex.test(user.password)) {
      toast("Password must contain letters, numbers & special character");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/signup", user);

      setMessage(res.data.message);
      toast.success("Registration successful! OTP sent to email.");
      setShowOtpModal(true); // Open OTP modal
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // OTP VERIFY
  const handleVerifyOtp = async () => {
    setOtpLoading(true);
    setError("");

    try {
      await axios.post("/api/auth/verifyOtp", {
        email: user.email,
        otp,
      });
      navigate("/login"); // redirect after verify
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
      toast.error(err.message || "Invalid OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <>
      {/* ================= REGISTER CARD ================= */}
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-white px-4">
        <Card className="w-full max-w-md shadow-xl border">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold text-green-700">
              Create Account
            </CardTitle>
            <CardDescription>
              Secure registration with email verification
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleRegister}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Email address</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="name@domain.gov"
                  value={user.email}
                  onChange={handleInput}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  name="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={user.password}
                  onChange={handleInput}
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}

              {message && (
                <p className="text-sm text-green-600 text-center">{message}</p>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-green-700 hover:bg-green-800 text-white"
              >
                {loading ? "Creating account..." : "Sign Up"}
              </Button>

              <p className="text-sm text-muted-foreground">
                OTP will be sent to your email
              </p>

              <Link
                to="/login"
                className="text-sm text-green-700 hover:underline"
              >
                Already have an account? Login
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* ================= OTP MODAL ================= */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in">
            <div className="container">
              <NavLink to="/login" className="text-gray-500 hover:text-gray-700 flex justify-end text-lg font-bold">
                ×
              </NavLink>
            </div>
            <h2 className="text-xl font-semibold text-center text-green-700">
              Verify OTP
            </h2>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Enter the 6-digit OTP sent to your email
            </p>

            <Input
              className="mt-6 text-center tracking-widest text-lg"
              placeholder="******"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
            />

            {error && (
              <p className="text-sm text-red-600 text-center mt-3">{error}</p>
            )}

            <Button
              onClick={handleVerifyOtp}
              disabled={otpLoading}
              className="w-full mt-6 bg-green-700 hover:bg-green-800 text-white"
            >
              {otpLoading ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

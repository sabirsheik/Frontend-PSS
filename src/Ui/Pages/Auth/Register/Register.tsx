import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useSignup } from "../../../../Hook/Auth/useAuth";
import { useVerifyOtp } from "../../../../Hook/Auth/useAuth";
import { toast } from "sonner";
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

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; otp?: string }>({});

  const signupMutation = useSignup();
  const verifyOtpMutation = useVerifyOtp();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'otp') {
      setOtp(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateSignupForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.password)) {
      newErrors.password = "Password must contain letters, numbers & special characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOtpForm = () => {
    const newErrors: { otp?: string } = {};

    if (!otp) {
      newErrors.otp = "OTP is required";
    } else if (otp.length !== 6) {
      newErrors.otp = "OTP must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateSignupForm()) return;

    try {
      const res = await signupMutation.mutateAsync(formData);
      toast.success(res.message || "Registration successful! OTP sent to email.");
      setShowOtpModal(true);
    } catch (err: String | any) {
      const errorMessage = err.message || "Registration failed";
      toast.error(errorMessage);

      // Handle specific backend errors
      if (errorMessage.toLowerCase().includes('email')) {
        setErrors({ email: errorMessage });
      } else if (errorMessage.toLowerCase().includes('password')) {
        setErrors({ password: errorMessage });
      }
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateOtpForm()) return;

    try {
      await verifyOtpMutation.mutateAsync({
        email: formData.email,
        otp,
      });
      toast.success("OTP verified successfully!");
      navigate("/login");
    } catch (err: any) {
      const errorMessage = err.message || "Invalid OTP";
      setErrors({ otp: errorMessage });
      toast.error(errorMessage);
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
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@domain.gov"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                disabled={signupMutation.isPending}
                className="w-full mt-4 bg-green-700 hover:bg-green-800 text-white"
              >
                {signupMutation.isPending ? "Creating account..." : "Sign Up"}
              </Button>

              <p className="text-sm text-muted-foreground">
                OTP will be sent to your email
              </p>

              <NavLink
                to="/login"
                className="text-sm text-green-700 hover:underline"
              >
                Already have an account? Login
              </NavLink>
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
              onChange={(e) => handleInputChange(e)}
              maxLength={6}
              name="otp"
            />

            {errors.otp && (
              <p className="text-sm text-red-600 text-center mt-3">{errors.otp}</p>
            )}

            <Button
              onClick={handleVerifyOtp}
              disabled={verifyOtpMutation.isPending}
              className="w-full mt-6 bg-green-700 hover:bg-green-800 text-white"
            >
              {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
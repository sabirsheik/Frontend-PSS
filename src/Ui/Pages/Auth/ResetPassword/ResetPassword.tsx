import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useResetPassword } from "../../../../Hook/Auth/useResetPassword";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    otp?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const navigate = useNavigate();
  const location = useLocation();
  const resetPasswordMutation = useResetPassword();

  const email = location.state?.email;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: { otp?: string; newPassword?: string; confirmPassword?: string } = {};

    if (!formData.otp) {
      newErrors.otp = "OTP is required";
    } else if (formData.otp.length !== 6) {
      newErrors.otp = "OTP must be 6 digits";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    try {
      await resetPasswordMutation.mutateAsync({
        email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });

      toast.success("Password reset successful");
      navigate("/login");
    } catch (err: String | any) {
      const errorMessage = err.message || "Reset failed";
      toast.error(errorMessage);

      // Handle specific backend errors
      if (errorMessage.toLowerCase().includes('otp')) {
        setErrors({ otp: errorMessage });
      } else if (errorMessage.toLowerCase().includes('password')) {
        setErrors({ newPassword: errorMessage });
      }
    }
  };

  if (!email) {
    navigate("/login");
    return null;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-xl rounded-lg shadow-2xl border-0 relative z-10">
        <h2 className="text-xl font-semibold text-center mb-4">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg bg-white/50 backdrop-blur-sm"
              value={email}
              readOnly
            />
          </div>

          <div>
            <Label htmlFor="otp">OTP</Label>
            <Input
              id="otp"
              name="otp"
              type="text"
              placeholder="OTP"
              className="w-full px-4 py-2 border rounded-lg bg-white/50 backdrop-blur-sm"
              value={formData.otp}
              onChange={handleInputChange}
            />
            {errors.otp && (
              <p className="text-sm text-red-600">{errors.otp}</p>
            )}
          </div>

          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-2 border rounded-lg bg-white/50 backdrop-blur-sm"
              value={formData.newPassword}
              onChange={handleInputChange}
            />
            {errors.newPassword && (
              <p className="text-sm text-red-600">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border rounded-lg bg-white/50 backdrop-blur-sm"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <Button
            disabled={resetPasswordMutation.isPending}
            className={`w-full py-2 text-white rounded-lg ${
              resetPasswordMutation.isPending ? "bg-green-600" : "bg-green-700 hover:bg-green-800"
            }`}
          >
            {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};
export default ResetPassword;
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useResetPassword } from "../../../../Hook/Auth/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const resetPasswordMutation = useResetPassword();

  const email = location.state?.email;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: {
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    } else if (
      !/(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(
        formData.newPassword
      )
    ) {
      newErrors.newPassword =
        "Password must contain at least one letter, one number, and one special character";
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
        newPassword: formData.newPassword,
      });

      toast.success("Password reset successful");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.message || "Reset failed");
    }
  };

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  if (!email) {
    return null; // render nothing while redirecting
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-white px-4 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-br from-purple-200 to-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl relative z-10 border border-white/40">
        <h2 className="text-2xl font-semibold text-center text-baseColor mb-2">
          Reset Password
        </h2>
        <p className="text-center text-sm text-muted-foreground mb-6">
          Create a strong new password to secure your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative mt-2">
              <Input
                id="newPassword"
                name="newPassword"
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-600 mt-1">
                {errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative mt-2">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <Button
            disabled={resetPasswordMutation.isPending}
            className="w-full bg-baseColor hover:bg-hoverColor text-white rounded-lg py-2.5"
          >
            {resetPasswordMutation.isPending
              ? "Resetting..."
              : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResetPassword } from "../../../../Hook/Auth/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  email: string;
  onClose: () => void;
}

const ResetPasswordModal = ({ email, onClose }: Props) => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const navigate = useNavigate();
  const resetPasswordMutation = useResetPassword();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: { newPassword?: string; confirmPassword?: string } = {};

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
        newPassword: formData.newPassword,
      });

      toast.success("Password reset successful");
      onClose();
      navigate("/login");
    } catch (err: String | any) {
      const errorMessage = err.message || "Reset failed";
      toast.error(errorMessage);

      // Handle specific backend errors
      if (errorMessage.toLowerCase().includes('password')) {
        setErrors({ newPassword: errorMessage });
      }
    }
  };

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
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded"
              value={email}
              readOnly
            />
          </div>

          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-2 border rounded"
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
              className="w-full px-4 py-2 border rounded"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <Button
            disabled={resetPasswordMutation.isPending}
            className={`w-full py-2 text-white rounded ${
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

export default ResetPasswordModal;
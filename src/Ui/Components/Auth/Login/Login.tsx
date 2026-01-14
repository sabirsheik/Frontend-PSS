import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/auth";
import { useLogin } from "../../../../Hook/Auth/useLogin";
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

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const { fetchUser } = useAuth();
  const loginMutation = useLogin();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    try {
      const res = await loginMutation.mutateAsync(formData);
      toast.success(res.message || "Login successful");
      setFormData({ email: "", password: "" });
      fetchUser();
      navigate("/dashboard");
    } catch (err: any) {
      // Handle backend validation errors
      if (err.message) {
        toast.error(err.message);
        // If it's a specific field error, show it on the field
        if (err.message.toLowerCase().includes('email')) {
          setErrors({ email: err.message });
        } else if (err.message.toLowerCase().includes('password')) {
          setErrors({ password: err.message });
        }
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-green-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-xl relative z-10">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl text-green-700 font-semibold">
            Login to Your Account
          </CardTitle>
          <CardDescription>
            Login using your official email address
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
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

          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full mt-4 bg-green-700 hover:bg-green-800 text-white"
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>

            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-muted-foreground text-center">
                Don't have an account? &nbsp;
                <NavLink to="/register" className="underline text-green-600">
                  Register here
                </NavLink>
              </p>
              <p>
                <NavLink
                  to="/forget-password"
                  className="underline text-sm text-green-600"
                >
                  Forget Password
                </NavLink>
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
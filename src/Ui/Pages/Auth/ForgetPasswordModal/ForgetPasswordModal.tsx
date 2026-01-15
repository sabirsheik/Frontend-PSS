import { useState } from "react";
// Hook to handle forget password
import { useForgetPassword } from "../../../../Hook/Auth/useAuth";
import { toast } from "sonner";
import { NavLink } from "react-router-dom";
// UI Components
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
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
// OTP Verification Modal
import { OTPVerifyModal } from "../OtpVerify/OTPVerifyModal";

export const ForgetPasswordModal = () => {
  // State variables
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"forget" | "otp">("forget");
  //  Hook for forget password mutation
  const forgetPasswordMutation = useForgetPassword();
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // === VALIDATION === //
    if (!email) {
      setError("Please enter your email");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return;
    }
    // === API CALL === //
    try {
      // Call forget password mutation
      const res = await forgetPasswordMutation.mutateAsync({ email });
      // On success, show success message and move to OTP step
      toast.success(res.message || "OTP sent");
      setStep("otp");
    } catch (err: any) {
      const errorMessage = err.message || "Failed to send OTP";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  /* ================= OTP STEP ================= */
  // Render OTP verification modal if in OTP step
  if (step === "otp") {
    return <OTPVerifyModal email={email} onClose={() => setStep("forget")} />;
  }

  /* ================= FORGET PASSWORD UI ================= */
  return (
    // Modal
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-xl shadow-2xl border border-muted/40 relative">
        {/* Close Button */}
        <NavLink
          to="/login"
          className="absolute right-4 top-3 text-xl font-semibold text-muted-foreground hover:text-foreground"
        >
          ×
        </NavLink>

        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-xl font-semibold text-baseColor">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-sm">
            Enter your registered email to receive an OTP
          </CardDescription>
        </CardHeader>

        <Separator />

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/70"
              />
              {error && <p className="text-xs text-red-600">{error}</p>}
            </div>

            <div className="flex items-start gap-2 text-sm">
              <Checkbox id="confirm" required />
              <Label
                htmlFor="confirm"
                className="text-muted-foreground leading-snug"
              >
                I confirm this email belongs to my account
              </Label>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 mt-4">
            {/* if forgetpasswordmutation is pending button disabled */}
            <Button
              disabled={forgetPasswordMutation.isPending}
              className="w-full bg-baseColor hover:bg-hoverColor text-white"
            >
              {/* Button text changes based on mutation state */}
              {forgetPasswordMutation.isPending ? "Sending OTP..." : "Send OTP"}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Remember your password?
              {/* Link to login page */}
              <NavLink
                to="/login"
                className="ml-1 text-baseColor hover:underline"
              >
                Login
              </NavLink>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
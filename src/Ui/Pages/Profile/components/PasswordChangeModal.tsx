/**
 * ============================================================
 * Password Change Modal Component
 * ============================================================
 *
 * Modal dialog for changing user password with validation.
 *
 * @module Ui/Pages/Profile/components
 */

import { useCallback, useState } from "react";
import { Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Local Components
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";

interface PasswordChangeModalProps {
  onChangePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
  isChanging: boolean;
}

export const PasswordChangeModal = ({ onChangePassword, isChanging }: PasswordChangeModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [touched, setTouched] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleInputChange = useCallback((field: "currentPassword" | "newPassword" | "confirmPassword", value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleBlur = useCallback((field: "current" | "new" | "confirm") => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const toggleVisibility = useCallback((field: "current" | "new" | "confirm") => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const handleSubmit = useCallback(async () => {
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return;
    }

    // Password strength validation is handled in the indicator

    try {
      await onChangePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setIsOpen(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTouched({ current: false, new: false, confirm: false });
    } catch (error) {
      // Error handling in parent
    }
  }, [passwordData, onChangePassword]);

  const isNewPasswordValid = passwordData.newPassword.length >= 8 &&
    /[A-Za-z]/.test(passwordData.newPassword) &&
    /\d/.test(passwordData.newPassword) &&
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordData.newPassword);

  const passwordsMatch = passwordData.newPassword === passwordData.confirmPassword;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 hover:bg-baseColor hover:text-white transition-colors cursor-pointer"
        >
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new one. Your new password must meet all security requirements.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Current Password */}
          <div className="grid gap-2">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPasswords.current ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                onBlur={() => handleBlur("current")}
                placeholder="Enter current password"
                className="h-11 pl-4 pr-12"
              />
              <button
                type="button"
                onClick={() => toggleVisibility("current")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPasswords.current ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="grid gap-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPasswords.new ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => handleInputChange("newPassword", e.target.value)}
                onBlur={() => handleBlur("new")}
                placeholder="Enter new password"
                className={`h-11 pl-4 pr-12 ${
                  touched.new && !isNewPasswordValid && passwordData.newPassword
                    ? "border-red-500 focus-visible:ring-red-500"
                    : touched.new && isNewPasswordValid && passwordData.newPassword
                    ? "border-emerald-500 focus-visible:ring-emerald-500"
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() => toggleVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPasswords.new ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {touched.new && passwordData.newPassword && isNewPasswordValid && (
                <CheckCircle2 className="absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
              )}
            </div>
            {touched.new && !isNewPasswordValid && passwordData.newPassword && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Password does not meet all requirements
              </p>
            )}

            {/* Password Strength Indicator */}
            <PasswordStrengthIndicator password={passwordData.newPassword} touched={touched.new} />
          </div>

          {/* Confirm New Password */}
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                onBlur={() => handleBlur("confirm")}
                placeholder="Confirm new password"
                className={`h-11 pl-4 pr-12 ${
                  touched.confirm && passwordData.confirmPassword &&
                  !passwordsMatch
                    ? "border-red-500 focus-visible:ring-red-500"
                    : touched.confirm && passwordData.confirmPassword &&
                    passwordsMatch
                    ? "border-emerald-500 focus-visible:ring-emerald-500"
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() => toggleVisibility("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {touched.confirm && passwordData.confirmPassword &&
               passwordsMatch && (
                <CheckCircle2 className="absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
              )}
            </div>
            {touched.confirm && passwordData.confirmPassword &&
             !passwordsMatch && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Passwords do not match
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isChanging}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isChanging}
          >
            {isChanging ? "Changing..." : "Change Password"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
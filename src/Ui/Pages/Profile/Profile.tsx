/**
 * ============================================================
 * Profile Page Component
 * ============================================================
 *
 * User profile page displaying account information and settings.
 * Accessible from the dashboard header dropdown menu.
 *
 * Features:
 * - Display username and email
 * - Reset password button (UI only for now)
 * - Professional card-based layout
 * - Consistent with dashboard design system
 *
 * @module Ui/Pages/Profile
 */

import { useCallback, useState, useMemo } from "react";
import { toast } from "sonner";
import {
  User,
  Mail,
  KeyRound,
  Shield,
  Edit3,
  Check,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

// TanStack Query hooks
import { useUser, useUpdateProfile, useChangePassword } from "../../../Hook/Auth/useAuth";

// UI Components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// ============================================================
// Password Validation Configuration
// ============================================================

/**
 * Password strength requirements
 * Each requirement has a pattern and label for display
 */
const PASSWORD_REQUIREMENTS = [
  { key: "length", label: "At least 8 characters", pattern: /.{8,}/ },
  { key: "letter", label: "Contains a letter", pattern: /[A-Za-z]/ },
  { key: "number", label: "Contains a number", pattern: /\d/ },
  { key: "special", label: "Contains a special character", pattern: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/ },
] as const;

// ============================================================
// Custom Hook: usePasswordStrength
// ============================================================

/**
 * Hook to calculate password strength based on requirements
 */
const usePasswordStrength = (password: string) => {
  const results = useMemo(() => {
    return PASSWORD_REQUIREMENTS.map((req) => ({
      ...req,
      met: req.pattern.test(password),
    }));
  }, [password]);

  const strength = useMemo(() => {
    const metCount = results.filter((r) => r.met).length;
    if (metCount === 0) return { level: 0, label: "Too weak", color: "bg-gray-200" };
    if (metCount === 1) return { level: 25, label: "Weak", color: "bg-red-500" };
    if (metCount === 2) return { level: 50, label: "Fair", color: "bg-amber-500" };
    if (metCount === 3) return { level: 75, label: "Good", color: "bg-emerald-400" };
    return { level: 100, label: "Strong", color: "bg-emerald-600" };
  }, [results]);

  const isValid = useMemo(() => {
    return results.every((r) => r.met);
  }, [results]);

  return { results, strength, isValid };
};

// ============================================================
// Component
// ============================================================

/**
 * Profile Page Component
 *
 * Displays user profile information in a clean, professional layout
 * with editing capabilities for username and email.
 */
export const Profile = () => {
  // ========================================
  // Hooks
  // ========================================
  const { data: user } = useUser();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  // ========================================
  // State
  // ========================================
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: "",
    email: "",
  });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
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
  const [passwordTouched, setPasswordTouched] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Password strength validation hook
  const { results: passwordChecks, strength, isValid: isNewPasswordValid } = usePasswordStrength(passwordData.newPassword);

  // ========================================
  // Handlers
  // ========================================

  /**
   * Handle edit button click
   */
  const handleEditClick = useCallback(() => {
    if (user) {
      setEditData({
        username: user.username || "",
        email: user.email || "",
      });
      setIsEditing(true);
    }
  }, [user]);

  /**
   * Handle cancel edit
   */
  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditData({ username: "", email: "" });
  }, []);

  /**
   * Handle save profile changes
   */
  const handleSaveProfile = useCallback(async () => {
    if (!user) return;

    try {
      await updateProfileMutation.mutateAsync({
        id: user._id,
        data: {
          username: editData.username.trim() || undefined,
          email: editData.email.trim() || undefined,
        },
      });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    }
  }, [user, editData, updateProfileMutation]);

  /**
   * Handle input changes
   */
  const handleInputChange = useCallback((field: "username" | "email", value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  }, []);

  /**
   * Handle password input changes
   */
  const handlePasswordInputChange = useCallback((field: "currentPassword" | "newPassword" | "confirmPassword", value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  }, []);

  /**
   * Handle password input blur for touched state
   */
  const handlePasswordBlur = useCallback((field: "current" | "new" | "confirm") => {
    setPasswordTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = useCallback((field: "current" | "new" | "confirm") => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  }, []);

  /**
   * Handle password change submission
   */
  const handleChangePassword = useCallback(async () => {
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (!isNewPasswordValid) {
      toast.error("New password does not meet all requirements");
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully!");
      setIsPasswordModalOpen(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordTouched({ current: false, new: false, confirm: false });
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    }
  }, [passwordData, isNewPasswordValid, changePasswordMutation]);

  // ========================================
  // Render Helpers
  // ========================================

  /**
   * Render password strength indicator
   */
  const renderPasswordStrength = () => {
    if (!passwordData.newPassword || !passwordTouched.new) return null;

    return (
      <div className="space-y-3 mt-3">
        {/* Strength Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Password strength</span>
            <span className={`font-medium ${
              strength.level === 100 ? "text-emerald-600" :
              strength.level >= 75 ? "text-emerald-500" :
              strength.level >= 50 ? "text-amber-500" :
              "text-red-500"
            }`}>
              {strength.label}
            </span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${strength.color}`}
              style={{ width: `${strength.level}%` }}
            />
          </div>
        </div>

        {/* Requirements Checklist */}
        <div className="grid grid-cols-2 gap-1.5">
          {passwordChecks.map((check) => (
            <div
              key={check.key}
              className={`flex items-center gap-1.5 text-xs ${
                check.met ? "text-emerald-600" : "text-gray-400"
              }`}
            >
              {check.met ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              <span>{check.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ========================================
  // Render
  // ========================================
  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your account information and settings</p>
      </div>

      {/* Profile Card */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-4">
            {/* Avatar Placeholder */}
            <div className="w-16 h-16 bg-linear-to-br from-baseColor to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>

            <div>
              <CardTitle className="text-2xl text-gray-800">
                {user.username || "User"}
              </CardTitle>
              <CardDescription className="text-gray-600">
                Account created on {new Date(user.createdAt).toLocaleDateString()}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* User Information Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Shield className="w-5 h-5 text-baseColor" />
                Account Information
              </h3>
              {!isEditing ? (
                <Button
                  onClick={handleEditClick}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveProfile}
                    size="sm"
                    className="flex items-center gap-2"
                    disabled={updateProfileMutation.isPending}
                  >
                    <Check className="w-4 h-4" />
                    {updateProfileMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    disabled={updateProfileMutation.isPending}
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Username */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  Username
                </Label>
                {isEditing ? (
                  <Input
                    value={editData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    placeholder="Enter username"
                    className="w-full"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <p className="text-gray-800 font-medium">{user.username}</p>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  Email Address
                </Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter email address"
                    className="w-full"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <p className="text-gray-800 font-medium">{user.email}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Account Actions Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-baseColor" />
              Account Actions
            </h3>

            <div className="flex gap-4">
              <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 hover:bg-baseColor hover:text-white transition-colors cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
                          onChange={(e) => handlePasswordInputChange("currentPassword", e.target.value)}
                          onBlur={() => handlePasswordBlur("current")}
                          placeholder="Enter current password"
                          className="h-11 pl-4 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("current")}
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
                          onChange={(e) => handlePasswordInputChange("newPassword", e.target.value)}
                          onBlur={() => handlePasswordBlur("new")}
                          placeholder="Enter new password"
                          className={`h-11 pl-4 pr-12 ${
                            passwordTouched.new && !isNewPasswordValid && passwordData.newPassword
                              ? "border-red-500 focus-visible:ring-red-500"
                              : passwordTouched.new && isNewPasswordValid && passwordData.newPassword
                              ? "border-emerald-500 focus-visible:ring-emerald-500"
                              : ""
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("new")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          tabIndex={-1}
                        >
                          {showPasswords.new ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                        {passwordTouched.new && passwordData.newPassword && isNewPasswordValid && (
                          <CheckCircle2 className="absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                        )}
                      </div>
                      {passwordTouched.new && !isNewPasswordValid && passwordData.newPassword && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Password does not meet all requirements
                        </p>
                      )}
                      
                      {/* Password Strength Indicator */}
                      {renderPasswordStrength()}
                    </div>

                    {/* Confirm New Password */}
                    <div className="grid gap-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => handlePasswordInputChange("confirmPassword", e.target.value)}
                          onBlur={() => handlePasswordBlur("confirm")}
                          placeholder="Confirm new password"
                          className={`h-11 pl-4 pr-12 ${
                            passwordTouched.confirm && passwordData.confirmPassword &&
                            passwordData.newPassword !== passwordData.confirmPassword
                              ? "border-red-500 focus-visible:ring-red-500"
                              : passwordTouched.confirm && passwordData.confirmPassword &&
                              passwordData.newPassword === passwordData.confirmPassword
                              ? "border-emerald-500 focus-visible:ring-emerald-500"
                              : ""
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("confirm")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          tabIndex={-1}
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                        {passwordTouched.confirm && passwordData.confirmPassword &&
                         passwordData.newPassword === passwordData.confirmPassword && (
                          <CheckCircle2 className="absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                        )}
                      </div>
                      {passwordTouched.confirm && passwordData.confirmPassword &&
                       passwordData.newPassword !== passwordData.confirmPassword && (
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
                      onClick={() => setIsPasswordModalOpen(false)}
                      disabled={changePasswordMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleChangePassword}
                      disabled={changePasswordMutation.isPending}
                    >
                      {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Click the change password button to update your account password.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
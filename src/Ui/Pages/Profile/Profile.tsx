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

import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  User,
  Mail,
  KeyRound,
  Shield,
  Edit3,
  Check,
  X,
} from "lucide-react";

// TanStack Query hooks
import { useUser, useUpdateProfile } from "../../../Hook/Auth/useAuth";

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

  // ========================================
  // State
  // ========================================
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: "",
    email: "",
  });

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
   * Handle reset password button click
   * Currently UI only - shows toast message
   */
  const handleResetPassword = useCallback(() => {
    toast.info("Reset password functionality coming soon!");
  }, []);

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
              <Button
                onClick={handleResetPassword}
                variant="outline"
                className="flex items-center gap-2 hover:bg-baseColor hover:text-white transition-colors"
              >
                <KeyRound className="w-4 h-4" />
                Reset Password
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Click the reset password button to change your account password.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
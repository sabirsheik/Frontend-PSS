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

import { User } from "lucide-react";

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
import { Separator } from "@/components/ui/separator";

// Local Components
import { ProfileHeader } from "./components/ProfileHeader";
import { UserInfoSection } from "./components/UserInfoSection";
import { AccountActionsSection } from "./components/AccountActionsSection";

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
  // Handlers
  // ========================================

  /**
   * Handle profile update
   */
  const handleUpdateProfile = async (data: { username?: string; email?: string }) => {
    await updateProfileMutation.mutateAsync({
      id: user!._id,
      data,
    });
  };

  /**
   * Handle password change
   */
  const handleChangePassword = async (data: { currentPassword: string; newPassword: string }) => {
    await changePasswordMutation.mutateAsync(data);
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
      <ProfileHeader />

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
          <UserInfoSection
            user={user}
            onUpdateProfile={handleUpdateProfile}
            isUpdating={updateProfileMutation.isPending}
          />

          <Separator />

          <AccountActionsSection
            onChangePassword={handleChangePassword}
            isChangingPassword={changePasswordMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};
/**
 * ============================================================
 * User Info Section Component
 * ============================================================
 *
 * Displays and allows editing of user information (username and email).
 *
 * @module Ui/Pages/Profile/components
 */

import { useCallback, useState } from "react";
import { User, Mail, Edit3, Check, X } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

interface UserInfoSectionProps {
  user: User;
  onUpdateProfile: (data: { username?: string; email?: string }) => Promise<void>;
  isUpdating: boolean;
}

export const UserInfoSection = ({ user, onUpdateProfile, isUpdating }: UserInfoSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: "",
    email: "",
  });

  const handleEditClick = useCallback(() => {
    setEditData({
      username: user.username || "",
      email: user.email || "",
    });
    setIsEditing(true);
  }, [user]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditData({ username: "", email: "" });
  }, []);

  const handleSaveProfile = useCallback(async () => {
    try {
      await onUpdateProfile({
        username: editData.username.trim() || undefined,
        email: editData.email.trim() || undefined,
      });
      setIsEditing(false);
    } catch (error) {
      // Error handling is done in parent
    }
  }, [editData, onUpdateProfile]);

  const handleInputChange = useCallback((field: "username" | "email", value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <User className="w-5 h-5 text-baseColor" />
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
              disabled={isUpdating}
            >
              <Check className="w-4 h-4" />
              {isUpdating ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={handleCancelEdit}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={isUpdating}
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
  );
};
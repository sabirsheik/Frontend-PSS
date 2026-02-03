/**
 * ============================================================
 * Account Actions Section Component
 * ============================================================
 *
 * Displays account-related actions like password change.
 *
 * @module Ui/Pages/Profile/components
 */

import { KeyRound } from "lucide-react";

// Local Components
import { PasswordChangeModal } from "./PasswordChangeModal";

interface AccountActionsSectionProps {
  onChangePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
  isChangingPassword: boolean;
}

export const AccountActionsSection = ({ onChangePassword, isChangingPassword }: AccountActionsSectionProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <KeyRound className="w-5 h-5 text-baseColor" />
        Account Actions
      </h3>

      <div className="flex gap-4">
        <PasswordChangeModal
          onChangePassword={onChangePassword}
          isChanging={isChangingPassword}
        />
      </div>

      <p className="text-sm text-gray-500 mt-2">
        Click the change password button to update your account password.
      </p>
    </div>
  );
};
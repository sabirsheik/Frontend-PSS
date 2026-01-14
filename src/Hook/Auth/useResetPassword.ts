import { useMutation } from "@tanstack/react-query";
import apiFetch from "../api/fetchApi";

interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      return apiFetch("/api/auth/reset-password", {
        method: "POST",
        body: data,
      });
    },
  });
};
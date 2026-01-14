import { useMutation } from "@tanstack/react-query";
import apiFetch from "../api/fetchApi";

interface VerifyOtpData {
  email: string;
  otp: string;
}

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async (data: VerifyOtpData) => {
      return apiFetch("/api/auth/verifyOtp", {
        method: "POST",
        body: data,
      });
    },
  });
};
import { useMutation } from "@tanstack/react-query";
import apiFetch from "../api/fetchApi";

interface ForgetPasswordData {
  email: string;
}

export const useForgetPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgetPasswordData) => {
      return apiFetch("/api/auth/forget-password", {
        method: "POST",
        body: data,
      });
    },
  });
};
import { useMutation } from "@tanstack/react-query";
import apiFetch from "../api/fetchApi";

interface SignupData {
  email: string;
  password: string;
}

export const useSignup = () => {
  return useMutation({
    mutationFn: async (data: SignupData) => {
      return apiFetch("/api/auth/signup", {
        method: "POST",
        body: data,
      });
    },
  });
};
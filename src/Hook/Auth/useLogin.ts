import { useMutation } from "@tanstack/react-query";
import apiFetch from "../api/fetchApi";

interface LoginData {
  email: string;
  password: string;
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginData) => {
      return apiFetch("/api/auth/login", {
        method: "POST",
        body: data,
      });
    },
  });
};
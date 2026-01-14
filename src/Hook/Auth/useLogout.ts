import { useMutation } from "@tanstack/react-query";
import apiFetch from "../api/fetchApi";

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      return apiFetch("/api/auth/logout", {
        method: "POST",
      });
    },
  });
};
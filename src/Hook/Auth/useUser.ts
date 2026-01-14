import { useQuery } from "@tanstack/react-query";
import apiFetch from "../api/fetchApi";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const data = await apiFetch("/api/auth/user");
      return data ? data.userData : null;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
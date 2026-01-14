import { useMutation, useQuery } from "@tanstack/react-query";
import apiFetch from "../api/fetchApi";

// Signup API Call
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



// Login API Call
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


// Forget Password API Call
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


// Reset Password API Call
interface ResetPasswordData {
  email: string;
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



// Logout API Call
export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      return apiFetch("/api/auth/logout", {
        method: "POST",
      });
    },
  });
};


// Verify OTP API Call
interface VerifyOtpData {
  email: string;
  otp: string;
};

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


// Get User Data API Call
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
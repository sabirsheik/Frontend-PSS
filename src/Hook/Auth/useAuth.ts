import { useMutation, useQuery } from "@tanstack/react-query";
import apiFetch from "../api/fetchApi";

// Signup API Call
// handle signup data
interface SignupData {
  email: string;
  password: string;
}
// useSignup hook
export const useSignup = () => {
  // Return mutation for signup
  return useMutation({
    // Define mutation function
    mutationFn: async (data: SignupData) => {
      // Call signup API
      return apiFetch("/api/auth/signup", {
        method: "POST",
        body: data,
      });
    },
  });
};

// Login API Call
// handle login data
interface LoginData {
  email: string;
  password: string;
}
// useLogin hook
export const useLogin = () => {
  // Return mutation for login
  return useMutation({
    // Define mutation function
    mutationFn: async (data: LoginData) => {
      // Call login API
      return apiFetch("/api/auth/login", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      localStorage.setItem("isLoggedIn", "true");
    },
  });
};

// Forget Password API Call
interface ForgetPasswordData {
  email: string;
}
// Forget Password API Call
export const useForgetPassword = () => {
  // Return mutation for forget password
  return useMutation({
    // Define mutation function
    mutationFn: async (data: ForgetPasswordData) => {
      // Call forget password API
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
// Reset Password API Call
export const useResetPassword = () => {
  // Return mutation for reset password
  return useMutation({
    // Define mutation function
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
  // Return mutation for logout
  return useMutation({
    // Define mutation function
    mutationFn: async () => {
      return apiFetch("/api/auth/logout", {
        method: "POST",
      });
    },
    onSuccess: () => {
      localStorage.removeItem("isLoggedIn");
    },
  });
};

// Verify OTP API Call
interface VerifyOtpData {
  email: string;
  otp: string;
}
// Verify OTP API Call
export const useVerifyOtp = () => {
  // Return mutation for verify OTP
  return useMutation({
    // Define mutation function
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
  // Return query for user data
  return useQuery({
    // Define query function
    queryKey: ["user"],
    queryFn: async () => {
      const data = await apiFetch("/api/auth/user");
      if(data){
        localStorage.removeItem("isLoggedIn");
      }
      return data ? data.userData : null;
    },
    enabled : !!localStorage.getItem("isLoggedIn"),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

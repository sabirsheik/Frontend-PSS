/**
 * ============================================================
 * Authentication Hooks (TanStack Query)
 * ============================================================
 * 
 * Custom React hooks for authentication operations using TanStack Query.
 * These hooks provide a clean, type-safe interface for all auth-related
 * API calls with automatic caching, loading states, and error handling.
 * 
 * Why TanStack Query?
 * - Automatic caching and background refetching
 * - Built-in loading and error states
 * - Optimistic updates capability
 * - Request deduplication
 * - Automatic retry on failure
 * 
 * @module Hook/Auth/useAuth
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiFetch from "../api/fetchApi";

// ============================================================
// Type Definitions
// ============================================================

/** User data returned from the API */
export interface User {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin" | "analyst";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/** API Response wrapper */
interface AuthResponse {
  message: string;
}

interface LoginResponse extends AuthResponse {
  token?: string;
}

interface ForgetPasswordResponse extends AuthResponse {
  email: string;
}

interface UserResponse {
  success: boolean;
  userData: User;
}

/** Input types for mutations */
interface SignupInput {
  username: string;
  email: string;
  password: string;
}

interface LoginInput {
  identifier: string;
  password: string;
}

interface ForgetPasswordInput {
  identifier: string;
}

interface ResetPasswordInput {
  email: string;
  newPassword: string;
}

interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

interface UpdateProfileInput {
  username?: string;
  email?: string;
}

interface UpdateProfileResponse {
  success: boolean;
  user: User;
}

// ============================================================
// Query Keys
// ============================================================

/**
 * Centralized query keys for cache management
 * Using a factory pattern for consistent key generation
 */
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

// ============================================================
// Authentication Queries
// ============================================================

/**
 * Get Current User Hook
 * 
 * Fetches the currently authenticated user's data.
 * Only runs when the user is logged in (has localStorage flag).
 * 
 * @returns TanStack Query result with user data
 * 
 * @example
 * const { data: user, isLoading, isError } = useUser();
 * 
 * if (isLoading) return <LoadingSpinner />;
 * if (user) return <Dashboard user={user} />;
 * return <LoginPage />;
 */
export const useUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async (): Promise<User | null> => {
      const response = await apiFetch<UserResponse | null>("/api/auth/user");
      
      // Handle unauthenticated state
      if (!response) {
        localStorage.removeItem("isLoggedIn");
        return null;
      }
      
      return response.userData;
    },
    // Only fetch if user might be logged in
    enabled: !!localStorage.getItem("isLoggedIn"),
    // Don't retry on auth failures
    retry: false,
    // Keep data fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================================
// Authentication Mutations
// ============================================================

/**
 * Signup Mutation Hook
 * 
 * Registers a new user account.
 * 
 * @returns TanStack Mutation for signup operation
 * 
 * @example
 * const signupMutation = useSignup();
 * 
 * const handleSubmit = async (data) => {
 *   try {
 *     await signupMutation.mutateAsync(data);
 *     toast.success("Registration successful!");
 *   } catch (error) {
 *     toast.error(error.message);
 *   }
 * };
 */
export const useSignup = () => {
  return useMutation({
    mutationFn: async (data: SignupInput): Promise<AuthResponse> => {
      return apiFetch<AuthResponse>("/api/auth/signup", {
        method: "POST",
        body: data,
      });
    },
  });
};

/**
 * Login Mutation Hook
 * 
 * Authenticates user and establishes session.
 * On success, sets localStorage flag and invalidates user query.
 * 
 * @returns TanStack Mutation for login operation
 * 
 * @example
 * const loginMutation = useLogin();
 * const { refetch: fetchUser } = useUser();
 * 
 * const handleLogin = async (credentials) => {
 *   try {
 *     await loginMutation.mutateAsync(credentials);
 *     fetchUser(); // Refresh user data
 *     navigate("/dashboard");
 *   } catch (error) {
 *     toast.error(error.message);
 *   }
 * };
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: LoginInput): Promise<LoginResponse> => {
      return apiFetch<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      // Mark user as logged in
      localStorage.setItem("isLoggedIn", "true");
      // Invalidate user query to trigger refetch
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
};

/**
 * Forget Password Mutation Hook
 * 
 * Initiates password reset flow by sending reset link to email.
 * 
 * @returns TanStack Mutation for password reset initiation
 * 
 * @example
 * const forgetPasswordMutation = useForgetPassword();
 * 
 * const handleSubmit = async (email) => {
 *   try {
 *     await forgetPasswordMutation.mutateAsync({ email });
 *     toast.success("Reset link sent to your email!");
 *   } catch (error) {
 *     toast.error(error.message);
 *   }
 * };
 */
export const useForgetPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgetPasswordInput): Promise<ForgetPasswordResponse> => {
      return apiFetch<ForgetPasswordResponse>("/api/auth/forget-password", {
        method: "POST",
        body: data,
      });
    },
  });
};

/**
 * Reset Password Mutation Hook
 * 
 * Completes password reset.
 * 
 * @returns TanStack Mutation for password reset completion
 * 
 * @example
 * const resetPasswordMutation = useResetPassword();
 * 
 * const handleReset = async (email, newPassword) => {
 *   try {
 *     await resetPasswordMutation.mutateAsync({ email, newPassword });
 *     toast.success("Password reset successful!");
 *     navigate("/login");
 *   } catch (error) {
 *     toast.error(error.message);
 *   }
 * };
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordInput): Promise<AuthResponse> => {
      return apiFetch<AuthResponse>("/api/auth/reset-password", {
        method: "POST",
        body: data,
      });
    },
  });
};

/**
 * Change Password Mutation Hook
 * 
 * Changes password for authenticated users.
 * Requires current password verification.
 * 
 * @returns TanStack Mutation for password change
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordInput): Promise<AuthResponse> => {
      return apiFetch<AuthResponse>("/api/auth/change-password", {
        method: "PUT",
        body: data,
      });
    },
  });
};

/**
 * Update Profile Mutation Hook
 * 
 * Updates the current user's profile information (username and/or email).
 * 
 * @returns TanStack Mutation for profile update operation
 * 
 * @example
 * const updateProfileMutation = useUpdateProfile();
 * const { data: user } = useUser();
 * 
 * const handleUpdateProfile = async (updates) => {
 *   try {
 *     await updateProfileMutation.mutateAsync({
 *       id: user._id,
 *       data: updates
 *     });
 *     toast.success("Profile updated successfully!");
 *   } catch (error) {
 *     toast.error(error.message);
 *   }
 * };
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProfileInput }): Promise<UpdateProfileResponse> => {
      return apiFetch<UpdateProfileResponse>(`/api/users/profile/${id}`, {
        method: "PUT",
        body: data,
      });
    },
    onSuccess: (response) => {
      // Update the user data in cache
      queryClient.setQueryData(authKeys.user(), response.user);
      // Invalidate user query to ensure consistency
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
};

/**
 * Logout Mutation Hook
 * 
 * Ends user session and clears authentication state.
 * Clears localStorage and invalidates user query cache.
 * 
 * @returns TanStack Mutation for logout operation
 * 
 * @example
 * const logoutMutation = useLogout();
 * const { refetch: fetchUser } = useUser();
 * 
 * const handleLogout = async () => {
 *   try {
 *     await logoutMutation.mutateAsync();
 *     fetchUser(); // Clear user data
 *     navigate("/");
 *   } catch (error) {
 *     console.error("Logout failed:", error);
 *   }
 * };
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (): Promise<AuthResponse> => {
      return apiFetch<AuthResponse>("/api/auth/logout", {
        method: "POST",
      });
    },
    onSuccess: () => {
      // Clear login flag
      localStorage.removeItem("isLoggedIn");
      // Clear user data from cache
      queryClient.setQueryData(authKeys.user(), null);
      // Invalidate all auth-related queries
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    onError: () => {
      // Even on error, clear local state (server might have cleared session)
      localStorage.removeItem("isLoggedIn");
      queryClient.setQueryData(authKeys.user(), null);
    },
  });
};
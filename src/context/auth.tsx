import React, { createContext, useContext } from "react";
import { useUser } from "../Hook/Auth/useAuth";
import { useLogout } from "../Hook/Auth/useAuth";

const AuthContext = createContext<any>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading, refetch: fetchUser } = useUser();
  const logoutMutation = useLogout();

  // LOGOUT
  const LogoutUser = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.log("Logout error", error);
    } finally {
      // Invalidate user query or set to null
      fetchUser();
    }
  };

  // LOGIN STATUS
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        LogoutUser,
        fetchUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// CUSTOM HOOK
export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return authContextValue;
};

export default AuthProvider;

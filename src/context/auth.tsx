import React, { createContext, useContext, useEffect, useState } from "react";
import axios from '../api/axios';
const AuthContext = createContext<any>(null);

const Api = import.meta.env.VITE_API_URL;
const USER_URL = "/api/auth/user";
const LOGOUT_URL = "/api/auth/logout";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // user state
  const [user, setUser] = useState<any>(null);

  // loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // AUTH CHECK (COOKIE BASED)
  const useAuthentication = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(`${USER_URL}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setUser(response.data.userData);
      } else {
        setUser(undefined);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  //  LOGOUT
  const LogoutUser = async () => {
    try {
      await axios.post(
        `${LOGOUT_URL}`,
        {},
        {
          withCredentials: true, //cookies send hongi
        }
      );
    } catch (error) {
      console.log("Logout error", error);
    } finally {
      setUser(null);
    }
  };

  // FIRST LOAD AUTH CHECK
  useEffect(() => {
    // useAuthentication();
  }, []);

  // LOGIN STATUS
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        LogoutUser,
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

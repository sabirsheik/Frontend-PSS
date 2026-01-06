import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
const AuthContext = createContext<any>(null);

const Api = import.meta.env.VITE_API_URL;
const USER_URL = "/users/user";
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

      const response = await fetch(`${Api}${USER_URL}`, {
        method: "GET",
        credentials: "include", // cookie automatically send hogi
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.userData); // user mila → logged in
      } else {
        setUser(null); // not logged in
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
      `${Api}${LOGOUT_URL}`,
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
    useAuthentication();
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

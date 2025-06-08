import { useEffect, useState } from "react";
import type { User } from "../types/User";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const user = await response.json();
        setAuthState({
          isAuthenticated: true,
          user,
          loading: false,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    } catch {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const user = await response.json();
      setAuthState({
        isAuthenticated: true,
        user,
        loading: false,
      });

      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    try {
      // TODO: Replace with actual API call
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return {
    ...authState,
    login,
    logout,
  };
};

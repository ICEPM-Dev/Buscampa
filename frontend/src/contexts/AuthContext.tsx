/**
 * Contexto de autenticación para la aplicación.
 * Gestiona el estado de autenticación del usuario con OAuth.
 */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { User } from "../types";
import { authService } from "../services/auth.service";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  needsPhone: boolean;
  dismissPhoneModal: () => void;
  loginWithGoogle: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsPhone, setNeedsPhone] = useState(false);

  const isAuthenticated = Boolean(token && user);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.getMe();
      setUser(currentUser);
    } catch (error) {
      console.error("Error refreshing user:", error);
      logout();
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        try {
          await refreshUser();
        } catch (error) {
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [refreshUser]);

  const loginWithGoogle = async (token: string) => {
    try {
      const { api } = await import("../services/api");
      api.setToken(token);
      const currentUser = await authService.getMe();
      setToken(token);
      setUser(currentUser);

      if (!currentUser.phone) {
        setNeedsPhone(true);
      }
    } catch (error: any) {
      try {
        const { api } = await import("../services/api");
        api.clearToken();
      } catch (clearError) {
        console.error("Error clearing token:", clearError);
      }

      throw error;
    }
  };

  const dismissPhoneModal = () => setNeedsPhone(false);

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        needsPhone,
        dismissPhoneModal,
        loginWithGoogle,
        logout,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

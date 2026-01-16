import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type {
  User,
  LoginDto,
  RegisterUserDto,
  RegisterChurchDto,
  AuthResponse,
  UpdateProfileDto,
} from "../types";
import { authService } from "../services/auth.service";
import { showToast } from "../components/ui/Toast";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (dto: LoginDto) => Promise<void>;
  registerUser: (dto: RegisterUserDto) => Promise<void>;
  registerChurch: (dto: RegisterChurchDto) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const login = async (dto: LoginDto) => {
    try {
      const response: AuthResponse = await authService.login(dto);
      setToken(response.access_token);
      setUser(response.user);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al iniciar sesión";
      showToast.error(errorMessage);
      throw error;
    }
  };

  const registerUser = async (dto: RegisterUserDto) => {
    try {
      const response: AuthResponse = await authService.registerUser(dto);
      setToken(response.access_token);
      setUser(response.user);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al crear cuenta";
      showToast.error(errorMessage);
      throw error;
    }
  };

  const registerChurch = async (dto: RegisterChurchDto) => {
    try {
      const response: AuthResponse = await authService.registerChurch(dto);
      setToken(response.access_token);
      setUser(response.user);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al registrar iglesia";
      showToast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        registerUser,
        registerChurch,
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

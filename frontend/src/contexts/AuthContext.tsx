/**
 * Contexto de autenticación para la aplicación.
 * Gestiona el estado de autenticación del usuario, incluyendo login, registro y logout.
 * Proporciona hooks y funciones para manejar la sesión del usuario.
 */
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
} from "../types";
import { authService } from "../services/auth.service";
import { showToast } from "../components/ui/Toast";

/**
 * Interfaz del contexto de autenticación
 */
interface AuthContextType {
  user: User | null; // Usuario actual
  token: string | null; // Token JWT
  isAuthenticated: boolean; // Si está autenticado
  isLoading: boolean; // Si está cargando
  login: (dto: LoginDto) => Promise<void>; // Función de login
  loginWithGoogle: (token: string) => Promise<void>; // Login con Google OAuth
  registerUser: (dto: RegisterUserDto) => Promise<void>; // Registro de usuario
  registerChurch: (dto: RegisterChurchDto) => Promise<void>; // Registro de iglesia
  logout: () => void; // Logout
  refreshUser: () => Promise<void>; // Refrescar datos del usuario
  updateUser: (data: Partial<User>) => void; // Actualizar usuario localmente
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Proveedor del contexto de autenticación.
 * Maneja el estado global de autenticación y proporciona funciones para login/registro.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // Estados del contexto
  const [user, setUser] = useState<User | null>(null); // Usuario actual
  const [token, setToken] = useState<string | null>(null); // Token JWT
  const [isLoading, setIsLoading] = useState(true); // Estado de carga inicial

  // Derivado: está autenticado si tiene token y usuario
  const isAuthenticated = Boolean(token && user);

  /**
   * Refresca los datos del usuario desde el servidor.
   * Se usa para mantener sincronizados los datos del usuario.
   */
  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.getMe();
      setUser(currentUser);
    } catch (error) {
      console.error("Error refreshing user:", error);
      logout(); // Logout si hay error (token inválido)
    }
  }, []);

  /**
   * Efecto para inicializar la autenticación al cargar la app.
   * Recupera el token del localStorage y refresca los datos del usuario.
   */
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        try {
          await refreshUser(); // Obtener datos del usuario
        } catch (error) {
          logout(); // Logout si token inválido
        }
      }
      setIsLoading(false); // Terminar carga inicial
    };

    initAuth();
  }, [refreshUser]);

  /**
   * Función para iniciar sesión.
   * Llama al servicio de auth y actualiza el estado si es exitoso.
   */
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

  /**
   * Función para iniciar sesión con Google OAuth.
   * Recibe el token del callback de Google y establece la sesión.
   */
  const loginWithGoogle = async (token: string) => {
    try {
      const { api } = await import("../services/api");
      api.setToken(token); // Establecer token para requests futuras
      const currentUser = await authService.getMe();
      setToken(token);
      setUser(currentUser);
      showToast.success("¡Inicio de sesión con Google exitoso!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error en autenticación con Google";
      showToast.error(errorMessage);
      
      // Limpiar token si hay error
      try {
        const { api } = await import("../services/api");
        api.clearToken();
      } catch (clearError) {
        console.error("Error clearing token:", clearError);
      }
      
      throw error;
    }
  };

  /**
   * Función para registrar un usuario normal.
   * Crea la cuenta y automáticamente inicia sesión.
   */
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

  /**
   * Función para registrar una iglesia.
   * Crea la iglesia y la cuenta del administrador.
   */
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

  /**
   * Función para cerrar sesión.
   * Limpia el token y el estado del usuario.
   */
  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  /**
   * Actualiza los datos del usuario localmente.
   * Útil para actualizaciones optimistas sin llamar al servidor.
   */
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
        login,
        loginWithGoogle,
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

/**
 * Hook personalizado para acceder al contexto de autenticación.
 * Debe usarse dentro de un AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/**
 * Servicio de autenticación.
 * Maneja todas las llamadas a la API relacionadas con autenticación y gestión de usuarios.
 */
import { api } from "./api";
import type {
  AuthResponse,
  LoginDto,
  RegisterUserDto,
  RegisterChurchDto,
  User,
  UpdateProfileDto,
  ChangePasswordDto,
} from "../types";

export const authService = {
  /**
   * Inicia sesión con email y contraseña.
   * Guarda el token JWT en el cliente API.
   */
  async login(dto: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", dto);
    api.setToken(response.access_token); // Guardar token para futuras requests
    return response;
  },

  /**
   * Registra un nuevo usuario normal.
   * Automáticamente inicia sesión con el nuevo usuario.
   */
  async registerUser(dto: RegisterUserDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", dto);
    api.setToken(response.access_token);
    return response;
  },

  /**
   * Registra una nueva iglesia y su administrador.
   * Inicia sesión automáticamente.
   */
  async registerChurch(dto: RegisterChurchDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register/church", dto);
    api.setToken(response.access_token);
    return response;
  },

  /**
   * Obtiene los datos del usuario autenticado.
   */
  async getMe(): Promise<User> {
    return api.get<User>("/auth/me");
  },

  /**
   * Actualiza el perfil del usuario autenticado.
   */
  async updateProfile(dto: UpdateProfileDto): Promise<User> {
    return api.put<User>("/auth/me", dto);
  },

  /**
   * Cambia la contraseña del usuario.
   */
  async changePassword(dto: ChangePasswordDto): Promise<void> {
    return api.put<void>("/auth/password", dto);
  },

  /**
   * Elimina la cuenta del usuario.
   */
  async deleteAccount(password: string): Promise<void> {
    return api.put<void>("/auth/delete-account", { password });
  },

  /**
   * Inicia el flujo de autenticación con Google OAuth.
   * Redirige al backend para iniciar el proceso con Google.
   */
  async loginWithGoogle(): Promise<void> {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    window.location.href = `${apiUrl}/auth/google`;
  },

  /**
   * Cierra sesión limpiando el token.
   */
  logout() {
    api.clearToken();
  },
};

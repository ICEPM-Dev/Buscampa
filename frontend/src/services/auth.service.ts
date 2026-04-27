/**
 * Servicio de autenticación.
 * Solo maneja OAuth (Google, Facebook) y gestión de usuarios.
 */
import { api } from "./api";
import type {
  User,
  UpdateProfileDto,
  ChangePasswordDto,
} from "../types";

export const authService = {
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
  async deleteAccount(): Promise<void> {
    return api.put<void>("/auth/delete-account", {});
  },

  /**
   * Cierra sesión limpiando el token.
   */
  logout() {
    api.clearToken();
  },
};
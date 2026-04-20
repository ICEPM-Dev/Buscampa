/**
 * Definiciones de tipos TypeScript para la aplicación Buscampa.
 * Incluye interfaces para usuarios, autenticación, campamentos e inscripciones.
 */

export type UserType = "USER" | "IGLESIA";

/** Usuario del sistema */
export interface User {
  id: number;
  email: string;
  name: string;
  type: UserType;
  phone?: string;
  
  // 🆕 Campos OAuth
  googleId?: string;
  provider?: 'email' | 'google' | 'both';
  isOAuthUser?: boolean;
}

/** Respuesta de autenticación */
export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterUserDto {
  email: string;
  name: string;
  password: string;
}

export interface RegisterChurchDto {
  email: string;
  name: string;
  password: string;
  denomination: string;
}

export interface Iglesia {
  id: number;
  name: string;
  denomination: string;
  phone?: string;
  userId?: number;
}

export interface Campamento {
  id: number;
  name: string;
  description?: string;
  location: string;
  startDate: string;
  endDate: string;
  price: number;
  churchId: number;
  church: Iglesia;
  createdAt: string;
}

export interface Registration {
  id: number;
  userId: number;
  user: User;
  campamentoId: number;
  campamento: Campamento;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface CreateCampamentoDto {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  price: number;
  location: string;
}

export interface UpdateCampamentoDto {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  price?: number;
  location?: string;
}

export interface CreateInscriptionDto {
  fullName: string;
  email: string;
  phone: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

export interface UpdateProfileDto {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

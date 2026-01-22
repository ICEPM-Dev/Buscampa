/**
 * Servicio API centralizado.
 * Gestiona todas las llamadas HTTP al backend usando Axios.
 * Incluye manejo automático de tokens JWT y errores.
 */
import axios, { type AxiosInstance, AxiosError } from "axios";
import type { ApiError } from "../types";

// URL base de la API desde variables de entorno
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

class ApiService {
  private client: AxiosInstance; // Instancia de Axios
  private token: string | null = null; // Token JWT actual

  constructor() {
    // Crear instancia de Axios con configuración base
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Cargar token desde localStorage
    this.token = localStorage.getItem("token");

    // Interceptor de requests: agregar token de autorización
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor de responses: manejar errores 401 y formatear errores
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.logout(); // Logout automático en 401
        }
        return Promise.reject(this.formatError(error));
      }
    );
  }

  /**
   * Establece el token JWT y lo guarda en localStorage.
   */
  setToken(token: string) {
    this.token = token;
    localStorage.setItem("token", token);
  }

  /**
   * Limpia el token JWT de memoria y localStorage.
   */
  clearToken() {
    this.token = null;
    localStorage.removeItem("token");
  }

  /**
   * Cierra sesión y redirige al login.
   */
  logout() {
    this.clearToken();
    window.location.href = "/login";
  }

  /**
   * Formatea errores de Axios para consistencia.
   */
  private formatError(error: any): ApiError {
    return {
      message:
        error.response?.data?.message ||
        error.message ||
        "Error en la petición",
      statusCode: error.response?.status,
    };
  }

  /**
   * Método GET para solicitudes HTTP.
   */
  async get<T>(url: string): Promise<T> {
    const response = await this.client.get<T>(url);
    return response.data;
  }

  /**
   * Método POST para crear recursos.
   */
  async post<T>(url: string, data: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  /**
   * Método PUT para actualizar recursos.
   */
  async put<T>(url: string, data: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  /**
   * Método DELETE para eliminar recursos.
   */
  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

// Instancia singleton del servicio API
export const api = new ApiService();

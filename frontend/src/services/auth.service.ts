import { api } from './api';
import type {
  AuthResponse,
  LoginDto,
  RegisterUserDto,
  RegisterChurchDto,
  User,
  UpdateProfileDto,
  ChangePasswordDto,
} from '../types';

export const authService = {
  async login(dto: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', dto);
    api.setToken(response.access_token);
    return response;
  },

  async registerUser(dto: RegisterUserDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', dto);
    api.setToken(response.access_token);
    return response;
  },

  async registerChurch(dto: RegisterChurchDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register/church', dto);
    api.setToken(response.access_token);
    return response;
  },

  async getMe(): Promise<User> {
    return api.get<User>('/auth/me');
  },

  async updateProfile(dto: UpdateProfileDto): Promise<User> {
    return api.put<User>('/auth/me', dto);
  },

  async changePassword(dto: ChangePasswordDto): Promise<void> {
    return api.put<void>('/auth/password', dto);
  },

  async deleteAccount(password: string): Promise<void> {
    return api.put<void>('/auth/delete-account', { password });
  },

  logout() {
    api.clearToken();
  },
};
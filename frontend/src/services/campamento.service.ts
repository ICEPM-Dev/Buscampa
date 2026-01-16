import { api } from './api';
import type {
  Campamento,
  CreateCampamentoDto,
  UpdateCampamentoDto,
} from '../types';

export const campamentoService = {
  async getAll(): Promise<Campamento[]> {
    return api.get<Campamento[]>('/campamentos');
  },

  async getById(id: number): Promise<Campamento> {
    return api.get<Campamento>(`/campamentos/${id}`);
  },

  async create(dto: CreateCampamentoDto): Promise<Campamento> {
    return api.post<Campamento>('/campamentos', dto);
  },

  async update(id: number, dto: UpdateCampamentoDto): Promise<Campamento> {
    return api.put<Campamento>(`/campamentos/${id}`, dto);
  },

  async delete(id: number): Promise<void> {
    return api.delete<void>(`/campamentos/${id}`);
  },
};
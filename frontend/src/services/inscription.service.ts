/**
 * Servicio para operaciones con inscripciones.
 * Maneja consultas y creación de inscripciones a campamentos.
 */
import { api } from "./api";
import type { Registration, CreateInscriptionDto } from "../types";

export const inscriptionService = {
  async getMyInscriptions(): Promise<Registration[]> {
    return api.get<Registration[]>("/inscription/me");
  },

  async getByCampamento(campamentoId: number): Promise<Registration[]> {
    return api.get<Registration[]>(
      `/campamentos/${campamentoId}/inscripciones`
    );
  },

  async create(
    campamentoId: number,
    dto: CreateInscriptionDto
  ): Promise<Registration> {
    return api.post<Registration>(
      `/campamentos/${campamentoId}/inscribirse`,
      dto
    );
  },

  async cancel(id: number): Promise<void> {
    return api.delete<void>(`/inscription/${id}`);
  },
};

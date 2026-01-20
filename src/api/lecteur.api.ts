import { apiLecteur } from "./axios";
import { Lecteur } from "../types/Lecteur";
import { LecteurRegister } from "../types/LecteurRegister";

export const LecteurAPI = {
  register: async (data: LecteurRegister): Promise<Lecteur> => {
    const res = await apiLecteur.post("/v1/lecteurs/register", data);
    return res.data;
  },

  getAll: async (): Promise<Lecteur[]> => {
    const res = await apiLecteur.get("/v1/lecteurs");
    return res.data;
  },

  getById: async (id: string): Promise<Lecteur> => {
    const res = await apiLecteur.get(`/v1/lecteurs/${id}`);
    return res.data;
  },

  update: async (id: string, data: Partial<LecteurRegister>): Promise<Lecteur> => {
    const res = await apiLecteur.put(`/v1/lecteurs/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiLecteur.delete(`/v1/lecteurs/${id}`);
  },
};
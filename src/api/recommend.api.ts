// api/recommend.api.ts
import { apiML } from "./axios"; // axios configuré avec JWT

export interface Livre {
  idLivre: number;
  titre: string;
  auteur: string;
  genre: string;
  synopsis: string;
  numChapters?: number;
  numPages?: number;
  numTotalLivres?: number;
  isbn?: string;
  image?: string; // Base64 ou URL
}

export const RecommendAPI = {
  getRecommendations: async (): Promise<Livre[]> => {
    const res = await apiML.get("/recommend");
    // res.data.recommendations contient maintenant des objets Livre complets
    return res.data.recommendations as Livre[];
  },
};
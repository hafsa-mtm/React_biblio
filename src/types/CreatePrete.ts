export interface CreatePrete {
  titre: string;
  description?: string;
  idLivre: number;
  user_id: string;
  demande: boolean;
  livreRetourne: boolean;
}

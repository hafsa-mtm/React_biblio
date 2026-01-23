import { Book } from "./Book";
import { Lecteur } from "./lecteur";

export type PretStatut =
  | "EN_ATTENTE"
  | "ACCEPTE"
  | "REFUSE"
  | "RETOURNE";


export interface Prete {
  idPret?: number;

  titre: string;
  description?: string;

  datePret?: string;  
  dateFinPret?: string;

  livreRetourne?: boolean;
  demande?: boolean;

  user_id?: string; 
  idLivre: number;

  statut?: PretStatut; 

  livre?: Book;
  lecteur?: Lecteur;
}
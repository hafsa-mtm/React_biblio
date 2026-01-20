export interface Lecteur {
  id_lecteur: string;
  nom: string;
  prenom: string;
  date_naissance: string;
  email: string;
  role: "LECTEUR";
  created_at?: string;
  updated_at?: string;
}
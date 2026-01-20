export interface Bibliothecaire {
  id_bibliothecaire: string;
  nom: string;
  prenom: string;
  email: string;
  role: "BIBLIOTHECAIRE";
  date_naissance: string;
  created_at?: string;
  updated_at?: string;
}
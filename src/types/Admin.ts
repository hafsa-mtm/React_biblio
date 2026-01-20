export interface Admin {
  id_admin: string;
  nom: string;
  prenom: string;
  email: string;
  role: "ADMIN";
  date_naissance: string;
  created_at?: string;
  updated_at?: string;
}
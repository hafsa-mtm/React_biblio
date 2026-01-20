export type UserRole = "ADMIN" | "BIBLIOTHECAIRE" | "LECTEUR";

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
  date_naissance?: string;
  created_at?: string;
}
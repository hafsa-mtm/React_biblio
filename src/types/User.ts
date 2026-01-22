export type UserRole = "ADMIN" | "BIBLIOTHECAIRE" | "LECTEUR";

// Définition de l'interface User
export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
  date_naissance?: string;
  created_at?: string;
}
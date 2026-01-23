import { Prete } from "../types/Pret";

export type PretStatusCode =
  | "DEMANDE"
  | "ACTIF"
  | "RETARD"
  | "RETOURNE";

export function computePretStatut(d: any) {
  const demande = d.demande ?? false;
  const livreRetourne = d.livreRetourne ?? d.livre_retourne ?? false;

  if (demande === true) return "EN_ATTENTE";
  if (demande === false && livreRetourne === true) return "RETOURNE";
  if (demande === false) return "ACCEPTE";

  return "REFUSE";
}


export const getPretStatus = (p: Prete): {
  code: PretStatusCode;
  label: string;
  color: string;
} => {
  const now = new Date();

  // Vérifier d'abord si le livre est retourné
  if (p.livreRetourne) {
    return { code: "RETOURNE", label: "Retourné", color: "text-green-600" };
  }

  // Ensuite vérifier si c'est une demande
  if (p.demande) {
    return { code: "DEMANDE", label: "Demande", color: "text-yellow-600" };
  }

  // Vérifier si le prêt est en retard
  if (p.dateFinPret && new Date(p.dateFinPret) < now) {
    return { code: "RETARD", label: "En retard", color: "text-red-600" };
  }

  // Sinon, c'est un prêt actif
  return { code: "ACTIF", label: "Actif", color: "text-blue-600" };
};
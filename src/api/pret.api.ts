import { apiPret } from "./axios";
import { Prete } from "../types/Pret";
import { computePretStatut } from "../utils/pretStatus";


export const PretAPI = {
  creerDemande: async (prete: Prete): Promise<Prete> => {
    const res = await apiPret.post("/v1/pretes/demandes", prete);
    return res.data;
  },
  getDemandesLecteur: async (): Promise<Prete[]> => {
    const res = await apiPret.get("/v1/pretes/lecteurs/demandes");
    return res.data.map((d: any) => ({
      idPret: d.idPret || d.id_pret,
      titre: d.titre,
      description: d.description,
      // Corriger les noms de champs selon ce que le backend envoie
      datePret: d.datePret ? new Date(d.datePret).toISOString() : 
               d.date_pret ? new Date(d.date_pret).toISOString() : 
               new Date().toISOString(), // fallback
      dateFinPret: d.dateFinPret ? new Date(d.dateFinPret).toISOString() : 
                   d.date_fin_pret ? new Date(d.date_fin_pret).toISOString() : 
                   undefined,
      demande: d.demande,
      livreRetourne: d.livreRetourne || d.livre_retourne,
      statut: computePretStatut(d),
      user_id: d.userId || d.user_id,
      idLivre: d.idLivre || d.id_livre,
      livre: { 
        idLivre: d.idLivre || d.id_livre, 
        titre: d.titre 
      },
    }));
  },

  

  annulerDemande: async (idPret: number): Promise<void> => {
    try {
      await apiPret.delete(`/v1/pretes/lecteurs/demandes/${idPret}`);
    } catch (err: any) {
      console.error("Erreur lors de l'annulation :", err.response || err);
      throw new Error("Impossible d'annuler la demande"); 
    }
  },

   getDemandesBiblio: async (): Promise<Prete[]> => {
    const res = await apiPret.get("/v1/pretes/demandes");
     return res.data.map((d: any) => ({
    ...d,
    idPret: d.idPret || d.id_pret,
    datePret: d.datePret || d.date_pret,
    livreRetourne: d.livreRetourne || d.livre_retourne,
    demande: d.demande,

    statut: computePretStatut({
  demande: d.demande,
  livreRetourne: d.livreRetourne || d.livre_retourne,
}),
  }));
  },


  accepterDemande: async (idPret: number): Promise<Prete> => {
    const res = await apiPret.put(`/v1/pretes/demandes/${idPret}/accepter`);
    return res.data;
  },

  rejeterDemande: async (idPret: number): Promise<void> => {
    await apiPret.delete(`/v1/pretes/demandes/${idPret}/rejeter`);
  },

  getPretesActifsBiblio: async (): Promise<Prete[]> => {
  const res = await apiPret.get("/v1/pretes/actifs");

  return res.data.map((p: any) => ({
    idPret: p.idPret || p.id_pret,
    datePret: p.datePret || p.date_pret,
    dateFinPret: p.dateFinPret || p.date_fin_pret,
    livreRetourne: p.livreRetourne || p.livre_retourne,
    demande: p.demande,
    statut: computePretStatut(p),
    livre: p.livre,
    lecteur: p.lecteur,
  }));
},

retournerLivre: async (idPret: number) => {
  return apiPret.put(`/v1/pretes/${idPret}/retourner`);
},

prolongerPrete: async (idPret: number, newDateFinPret: string) => {
  return apiPret.put(
    `/v1/pretes/${idPret}/prolonger`,
    null,
    {
      params: { newDateFinPret }
    }
  );
},

getHistoriquePretesBiblio: async (): Promise<Prete[]> => {
  const res = await apiPret.get("/v1/pretes");

  return res.data.map((p: any) => ({
    idPret: p.idPret,
    datePret: p.datePret,
    dateFinPret: p.dateFinPret,
    livreRetourne: p.livreRetourne,
    demande: p.demande,
    statut: computePretStatut(p),
    livre: p.livre,
    lecteur: p.lecteur,
  }));
},

// frontend/src/api/pret.api.ts
getUserPretes: async (): Promise<Prete[]> => {
  const res = await apiPret.get("/v1/pretes/lecteurs/historique");
  return res.data.map((d: any) => ({
    idPret: d.idPret,
    titre: d.titre,
    description: d.description,
    datePret: d.datePret ? new Date(d.datePret).toISOString() : new Date().toISOString(),
    dateFinPret: d.dateFinPret ? new Date(d.dateFinPret).toISOString() : undefined,
    livreRetourne: d.livreRetourne,
    demande: d.demande,
    statut: computePretStatut(d),
    idLivre: d.idLivre,
    livre: d.livre,
    user_id: d.user_id,
  }));
},


};


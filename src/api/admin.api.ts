// admin.api.ts - FIXED VERSION
import { apiAdmin, apiLecteur, apiBiblio } from "./axios";
import { User } from "../types/User";
import { CreateUserDTO } from "../types/CreateUser";

export const AdminAPI = {
  getAllUsers: async (): Promise<User[]> => {
    console.log("🔄 Fetching all users...");
    
    try {
      // Add better error handling for each service
      const results = await Promise.allSettled([
        apiAdmin.get("/v1/admins/").catch(err => {
          console.error("Admin service error:", err.response?.data || err.message);
          return { data: [] };
        }),
        apiLecteur.get("/v1/lecteurs/").catch(err => {
          console.error("Lecteur service error:", err.response?.data || err.message);
          return { data: [] };
        }),
        apiBiblio.get("/v1/bibliothecaires/").catch(err => {
          console.error("Biblio service error:", err.response?.data || err.message);
          return { data: [] };
        }),
      ]);

      console.log("API results:", results);

      // Extract data from successful responses
      const [adminsResult, lecteursResult, bibliosResult] = results;
      
      const admins = adminsResult.status === 'fulfilled' ? adminsResult.value.data : [];
      const lecteurs = lecteursResult.status === 'fulfilled' ? lecteursResult.value.data : [];
      const biblios = bibliosResult.status === 'fulfilled' ? bibliosResult.value.data : [];

      console.log("Raw data - Admins:", admins);
      console.log("Raw data - Lecteurs:", lecteurs);
      console.log("Raw data - Biblios:", biblios);

      // Transform data with fallbacks
      const allUsers = [
        ...(Array.isArray(admins) ? admins.map((a: any) => ({
          id: a.id_admin?.toString() || a._id?.toString() || a.id?.toString() || '',
          nom: a.nom || 'Unknown',
          prenom: a.prenom || 'Unknown',
          email: a.email || 'no-email@example.com',
          role: "ADMIN" as const,
          date_naissance: a.date_naissance || '',
          created_at: a.created_at || new Date().toISOString(),
        })) : []),
        
        ...(Array.isArray(biblios) ? biblios.map((b: any) => ({
          id: b.id_bibliothecaire?.toString() || b._id?.toString() || b.id?.toString() || '',
          nom: b.nom || 'Unknown',
          prenom: b.prenom || 'Unknown',
          email: b.email || 'no-email@example.com',
          role: "BIBLIOTHECAIRE" as const,
          date_naissance: b.date_naissance || '',
          created_at: b.created_at || new Date().toISOString(),
        })) : []),
        
        ...(Array.isArray(lecteurs) ? lecteurs.map((l: any) => ({
          id: l.id_lecteur?.toString() || l._id?.toString() || l.id?.toString() || '',
          nom: l.nom || 'Unknown',
          prenom: l.prenom || 'Unknown',
          email: l.email || 'no-email@example.com',
          role: "LECTEUR" as const,
          date_naissance: l.date_naissance || '',
          created_at: l.created_at || new Date().toISOString(),
        })) : []),
      ];

      console.log("🔄 Combined users:", allUsers.length);
      console.log("Sample user:", allUsers[0]);
      
      return allUsers;
      
    } catch (error: any) {
      console.error("❌ Error in getAllUsers:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Return empty array instead of throwing to prevent UI crash
      return [];
    }
  },

  // ... rest of your functions remain the same
  createUser: async (data: CreateUserDTO) => {
    switch (data.role) {
      case "ADMIN":
        return apiAdmin.post("/v1/admins/", data);

      case "BIBLIOTHECAIRE":
        return apiBiblio.post("/v1/bibliothecaires/", data);

      case "LECTEUR":
        return apiLecteur.post("/v1/lecteurs/register", data);

      default:
        throw new Error("Rôle invalide");
    }
  },

  updateUser: async (
    userId: string,
    role: "ADMIN" | "BIBLIOTHECAIRE" | "LECTEUR",
    data: {
      nom: string;
      prenom: string;
      email: string;
      date_naissance: string;
      password?: string;
    }
  ) => {
    switch (role) {
      case "ADMIN":
        return apiAdmin.put(`/v1/admins/${userId}`, data);

      case "BIBLIOTHECAIRE":
        return apiBiblio.put(`/v1/bibliothecaires/${userId}`, data);

      case "LECTEUR":
        return apiLecteur.put(`/v1/lecteurs/${userId}`, data);

      default:
        throw new Error("Rôle invalide");
    }
  },

  changeUserRole: async (
    payload: {
      id: string;
      oldRole: "ADMIN" | "BIBLIOTHECAIRE" | "LECTEUR";
      newRole: "ADMIN" | "BIBLIOTHECAIRE" | "LECTEUR";
      nom: string;
      prenom: string;
      email: string;
      date_naissance: string;
      password?: string;
    }
  ) => {
    switch (payload.oldRole) {
      case "ADMIN":
        await apiAdmin.delete(`/v1/admins/${payload.id}`);
        break;
      case "BIBLIOTHECAIRE":
        await apiBiblio.delete(`/v1/bibliothecaires/${payload.id}`);
        break;
      case "LECTEUR":
        await apiLecteur.delete(`/v1/lecteurs/${payload.id}`);
        break;
    }

    return AdminAPI.createUser({
      nom: payload.nom,
      prenom: payload.prenom,
      email: payload.email,
      password: payload.password || "Temp123!",
      role: payload.newRole,
      date_naissance: payload.date_naissance,
    });
  },

  getUserById: async (
    id: string,
    role: "ADMIN" | "BIBLIOTHECAIRE" | "LECTEUR"
  ) => {
    switch (role) {
      case "ADMIN": {
        const res = await apiAdmin.get(`/v1/admins/${id}`);
        return {
          ...res.data,
          role: "ADMIN",
        };
      }

      case "BIBLIOTHECAIRE": {
        const res = await apiBiblio.get(`/v1/bibliothecaires/${id}`);
        return {
          ...res.data,
          role: "BIBLIOTHECAIRE",
        };
      }

      case "LECTEUR": {
        const res = await apiLecteur.get(`/v1/lecteurs/${id}`);
        return {
          ...res.data,
          role: "LECTEUR",
        };
      }

      default:
        throw new Error("Rôle invalide");
    }
  },

  deleteUser: async (
    id: string,
    role: "ADMIN" | "BIBLIOTHECAIRE" | "LECTEUR"
  ) => {
    switch (role) {
      case "ADMIN":
        return apiAdmin.delete(`/v1/admins/${id}`);

      case "BIBLIOTHECAIRE":
        return apiBiblio.delete(`/v1/bibliothecaires/${id}`);

      case "LECTEUR":
        return apiLecteur.delete(`/v1/lecteurs/${id}`);

      default:
        throw new Error("Rôle invalide");
    }
  },
};
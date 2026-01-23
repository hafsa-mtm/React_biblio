import { apiAdmin, apiLecteur, apiBiblio } from "./axios";
import { User } from "../types/User";
import { CreateUserDTO } from "../types/CreateUser";

export interface AdminStats {
  totalUsers: number;
  totalAdmins: number;
  totalBibliothecaires: number;
  totalLecteurs: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  usersByMonth: { label: string; value: number }[];
  usersByRole: { label: string; value: number; color: string }[];
  recentRegistrations: any[];
}

export const AdminAPI = {
  getAllUsers: async (): Promise<User[]> => {
    console.log("🔄 Fetching all users...");
    
    try {
      // Use Promise.allSettled instead of Promise.all to handle individual failures
      const [adminsResponse, lecteursResponse, bibliosResponse] = await Promise.allSettled([
        apiAdmin.get("/v1/admins/"),
        apiLecteur.get("/v1/lecteurs/"),
        apiBiblio.get("/v1/bibliothecaires/")
      ]);

      // Helper function to extract data with error handling
      const extractData = (result: PromiseSettledResult<any>, serviceName: string) => {
        if (result.status === 'fulfilled') {
          console.log(`✅ ${serviceName} service response:`, result.value.data);
          return result.value.data || [];
        } else {
          console.error(`❌ ${serviceName} service error:`, result.reason);
          console.error("Error details:", {
            status: result.reason?.response?.status,
            data: result.reason?.response?.data,
            url: result.reason?.config?.url
          });
          return [];
        }
      };

      const admins = extractData(adminsResponse, "Admin");
      const lecteurs = extractData(lecteursResponse, "Lecteur");
      const biblios = extractData(bibliosResponse, "Bibliothecaire");

      // Debug: Log the actual structure of returned data
      console.log("Raw admins data:", admins);
      console.log("Raw biblios data:", biblios);
      console.log("Raw lecteurs data:", lecteurs);

      // More flexible mapping - handle different field names
      const mapUsers = (users: any[], role: "ADMIN" | "BIBLIOTHECAIRE" | "LECTEUR") => {
        if (!Array.isArray(users)) return [];
        
        return users
          .filter((user: any) => user) // Filter out null/undefined
          .map((user: any) => ({
            id: user.userId || user.id_admin || user.id_bibliothecaire || user.id_lecteur || user._id || user.id || `temp-${Date.now()}`,
            nom: user.nom || 'N/A',
            prenom: user.prenom || 'N/A',
            email: user.email || 'N/A',
            role: role,
            date_naissance: user.date_naissance || user.dateNaissance || '',
            created_at: user.created_at || user.createdAt || new Date().toISOString(),
          }));
      };

      const mapAdmin = mapUsers(admins, "ADMIN");
      const mapBiblio = mapUsers(biblios, "BIBLIOTHECAIRE");
      const mapLecteur = mapUsers(lecteurs, "LECTEUR");

      console.log("Mapped users:", {
        admins: mapAdmin.length,
        biblios: mapBiblio.length,
        lecteurs: mapLecteur.length
      });

      return [...mapAdmin, ...mapBiblio, ...mapLecteur];

    } catch (error: any) {
      console.error("❌ Error in getAllUsers:", error);
      console.error("Full error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      return [];
    }
  },

  getUserById: async (
    id: string,
    role: "ADMIN" | "BIBLIOTHECAIRE" | "LECTEUR"
  ) => {
    console.log(`🔍 Getting ${role} with ID: ${id}`);
    
    try {
      let response;
      let userData;
      
      switch (role) {
        case "ADMIN": {
          response = await apiAdmin.get(`/v1/admins/${id}`);
          userData = response.data;
          console.log("Admin API response:", userData);
          console.log("Admin ID fields:", {
            userId: userData?.userId,
            id_admin: userData?.id_admin,
            _id: userData?._id,
            id: userData?.id
          });
          
          return {
            ...userData,
            id: userData.userId || userData.id_admin || userData._id || userData.id || id,
            role: "ADMIN" as const,
          };
        }

        case "BIBLIOTHECAIRE": {
          response = await apiBiblio.get(`/v1/bibliothecaires/${id}`);
          userData = response.data;
          console.log("Bibliothecaire API response:", userData);
          console.log("Bibliothecaire ID fields:", {
            userId: userData?.userId,
            id_bibliothecaire: userData?.id_bibliothecaire,
            _id: userData?._id,
            id: userData?.id
          });
          
          return {
            ...userData,
            id: userData.userId || userData.id_bibliothecaire || userData._id || userData.id || id,
            role: "BIBLIOTHECAIRE" as const,
          };
        }

        case "LECTEUR": {
          response = await apiLecteur.get(`/v1/lecteurs/${id}`);
          userData = response.data;
          console.log("Lecteur API response:", userData);
          console.log("Lecteur ID fields:", {
            userId: userData?.userId,
            id_lecteur: userData?.id_lecteur,
            _id: userData?._id,
            id: userData?.id
          });
          
          return {
            ...userData,
            id: userData.userId || userData.id_lecteur || userData._id || userData.id || id,
            role: "LECTEUR" as const,
          };
        }

        default:
          throw new Error("Rôle invalide");
      }
    } catch (error: any) {
      console.error(`❌ Error fetching ${role} with ID ${id}:`, error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        message: error.message
      });
      throw error;
    }
  },

  createUser: async (data: CreateUserDTO) => {
    console.log("Creating user with role:", data.role);
    console.log("Data to send:", data);
    
    const userData = {
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      password: data.password,
      date_naissance: data.date_naissance,
    };

    try {
      switch (data.role) {
        case "ADMIN":
          console.log("📝 Creating ADMIN at /v1/admins/");
          return await apiAdmin.post("/v1/admins/", userData);

        case "BIBLIOTHECAIRE":
          console.log("📝 Creating BIBLIOTHECAIRE at /v1/bibliothecaires/");
          return await apiBiblio.post("/v1/bibliothecaires/", userData);

        case "LECTEUR":
          console.log("📝 Creating LECTEUR at /v1/lecteurs/");
          // Try both endpoints
          try {
            return await apiLecteur.post("/v1/lecteurs/", userData);
          } catch (error) {
            console.log("Trying /register endpoint...");
            return await apiLecteur.post("/v1/lecteurs/register", userData);
          }

        default:
          throw new Error("Rôle invalide: " + data.role);
      }
    } catch (error: any) {
      console.error("❌ Error in createUser:", error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
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
    console.log(`✏️ Updating ${role} with ID: ${userId}`);
    console.log("Update data:", data);
    
    try {
      switch (role) {
        case "ADMIN":
          return await apiAdmin.put(`/v1/admins/${userId}`, data);

        case "BIBLIOTHECAIRE":
          return await apiBiblio.put(`/v1/bibliothecaires/${userId}`, data);

        case "LECTEUR":
          return await apiLecteur.put(`/v1/lecteurs/${userId}`, data);

        default:
          throw new Error("Rôle invalide");
      }
    } catch (error: any) {
      console.error(`❌ Error updating ${role}:`, error);
      throw error;
    }
  },

  changeUserRole: async (payload: {
    id: string;
    oldRole: "ADMIN" | "BIBLIOTHECAIRE" | "LECTEUR";
    newRole: "ADMIN" | "BIBLIOTHECAIRE" | "LECTEUR";
    nom: string;
    prenom: string;
    email: string;
    date_naissance: string;
    password?: string;
  }) => {
    console.log(`🔄 Changing role from ${payload.oldRole} to ${payload.newRole}`);
    
    try {
      // First get user data
      const user = await AdminAPI.getUserById(payload.id, payload.oldRole);
      
      // Delete from old role
      await AdminAPI.deleteUser(payload.id, payload.oldRole);
      
      // Create with new role
      return await AdminAPI.createUser({
        nom: payload.nom || user.nom,
        prenom: payload.prenom || user.prenom,
        email: payload.email || user.email,
        password: payload.password || "TempPassword123!",
        role: payload.newRole,
        date_naissance: payload.date_naissance || user.date_naissance,
      });
    } catch (error) {
      console.error("❌ Error in changeUserRole:", error);
      throw error;
    }
  },

  deleteUser: async (id: string, role: "ADMIN" | "BIBLIOTHECAIRE" | "LECTEUR") => {
    console.log(`🗑️ Deleting ${role} with ID: ${id}`);
    
    try {
      switch (role) {
        case "ADMIN":
          return await apiAdmin.delete(`/v1/admins/${id}`);

        case "BIBLIOTHECAIRE":
          return await apiBiblio.delete(`/v1/bibliothecaires/${id}`);

        case "LECTEUR":
          return await apiLecteur.delete(`/v1/lecteurs/${id}`);

        default:
          throw new Error("Rôle invalide");
      }
    } catch (error: any) {
      console.error(`❌ Error deleting ${role}:`, error);
      throw error;
    }
  },

   getDashboardStats: async (): Promise<AdminStats> => {
    console.log("📊 Fetching dashboard statistics...");
    
    try {
      // Récupérer tous les utilisateurs
      const allUsers = await AdminAPI.getAllUsers();
      
      // Calculer les statistiques
      const totalUsers = allUsers.length;
      const totalAdmins = allUsers.filter(user => user.role === "ADMIN").length;
      const totalBibliothecaires = allUsers.filter(user => user.role === "BIBLIOTHECAIRE").length;
      const totalLecteurs = allUsers.filter(user => user.role === "LECTEUR").length;
      
      // Simuler des données pour les autres statistiques (à adapter selon votre API réelle)
      const activeUsers = Math.floor(totalUsers * 0.9);
      const inactiveUsers = Math.floor(totalUsers * 0.05);
      const suspendedUsers = Math.floor(totalUsers * 0.05);
      
      // Générer les données par mois (6 derniers mois)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      const usersByMonth = months.slice(Math.max(0, currentMonth - 5), currentMonth + 1)
        .map((month, index) => ({
          label: month,
          value: Math.floor(Math.random() * 50) + 10
        }));
      
      // Données par rôle
      const usersByRole = [
        { label: 'Admins', value: totalAdmins, color: '#FF6B6B' },
        { label: 'Bibliothecaires', value: totalBibliothecaires, color: '#FF9B54' },
        { label: 'Lecteurs', value: totalLecteurs, color: '#FFD166' }
      ];
      
      // Inscriptions récentes (5 dernières)
      const recentRegistrations = allUsers
  .filter(u => u.created_at) // garder uniquement ceux qui ont une date
  .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
  .slice(0, 5);

      
      const stats: AdminStats = {
        totalUsers,
        totalAdmins,
        totalBibliothecaires,
        totalLecteurs,
        activeUsers,
        inactiveUsers,
        suspendedUsers,
        usersByMonth,
        usersByRole,
        recentRegistrations
      };
      
      console.log("📊 Dashboard stats calculated:", stats);
      return stats;
      
    } catch (error) {
      console.error("❌ Error fetching dashboard stats:", error);
      throw error;
    }
  },

  exportUsersToCSV: async (): Promise<Blob> => {
    try {
      const users = await AdminAPI.getAllUsers();
      
      // Convertir en CSV
      const headers = ['ID', 'Nom', 'Prénom', 'Email', 'Rôle', 'Date de Naissance', 'Date de Création'];
      const csvData = users.map(user => [
        user.id,
        user.nom,
        user.prenom,
        user.email,
        user.role,
        user.date_naissance,
        user.created_at
      ]);
      
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');
      
      return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
    } catch (error) {
      console.error('Error exporting CSV:', error);
      throw error;
    }
  },

  generateUserReport: async (): Promise<void> => {
    try {
      const stats = await AdminAPI.getDashboardStats();
      
      // Ici, vous pouvez envoyer les stats au backend pour générer un PDF
      // ou simplement afficher un message de succès
      console.log('Report generated with stats:', stats);
      
      // Pour l'instant, on simule le succès
      return Promise.resolve();
      
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
};
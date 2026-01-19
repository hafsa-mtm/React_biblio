// Déplacer TOUTES les importations en haut du fichier
import axios from 'axios';
import { format, subMonths } from 'date-fns';
import { Book, Loan, Member } from '../types/library';
import { LivreAPI } from './livre.api';
import { Book as BookType } from '../types/Book';

// Types for bibliothecaire stats
export interface BookStatusData {
  status: string;
  count: number;
}

export interface MonthlyTrendData {
  month: string;
  borrowed: number;
}

export interface RegistrationTrendData {
  month: string;
  count: number;
}

export interface RecentActivity {
  id: number;
  type: string;
  user: string;
  description: string;
  timestamp: string | Date;
}

export interface GenreStats {
  genre: string;
  count: number;
}

export interface BiblioStats {
  totalBooks: number;
  availableBooks: number;
  borrowedBooks: number;
  reservedBooks: number;
  pendingReturns: number;
  lateReturns: number;
  newRegistrations: number;
  booksByGenre: GenreStats[];
  borrowTrend: MonthlyTrendData[];
  recentActivity: RecentActivity[];
  lastUpdated: string;
}

export interface DashboardData {
  stats: BiblioStats;
  booksStatus: BookStatusData[];
  monthlyTrend: MonthlyTrendData[];
  registrationsTrend: RegistrationTrendData[];
}

// Interface pour les filtres d'export
export interface ExportFilters {
  startDate?: string;
  endDate?: string;
  status?: string;
  format?: 'csv' | 'excel' | 'pdf';
}

// Configuration
const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
  TIMEOUT: 10000,
};

// Fonction pour calculer les statistiques à partir des livres réels
const calculateStatsFromBooks = (books: BookType[]): DashboardData => {
  // 1. Calculer le total des livres
  const totalBooks = books.length;
  
  // 2. Calculer les livres par genre
  const genreCount: Record<string, number> = {};
  books.forEach(book => {
    if (book.genre) {
      genreCount[book.genre] = (genreCount[book.genre] || 0) + 1;
    }
  });
  
  const booksByGenre = Object.entries(genreCount)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);
  
  // 3. Calculer les livres disponibles (basé sur numTotalLivres)
  const totalCopies = books.reduce((sum, book) => {
    return sum + (book.numTotalLivres || 1);
  }, 0);
  
  // 4. Pour la démonstration, estimer les autres statistiques
  // (Dans un vrai système, vous auriez ces données d'un service de prêts)
  const borrowedBooks = Math.floor(totalBooks * 0.3); // 30% empruntés
  const reservedBooks = Math.floor(totalBooks * 0.1); // 10% réservés
  const pendingReturns = Math.floor(totalBooks * 0.05); // 5% à retourner
  const lateReturns = Math.floor(totalBooks * 0.02); // 2% en retard
  const newRegistrations = Math.floor(totalBooks * 0.03); // 3% nouvelles inscriptions
  
  // 5. Générer des tendances mensuelles (simulées)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const monthlyTrend = months.map((month, index) => ({
    month,
    borrowed: Math.floor(Math.random() * 50) + 20 + (index * 10)
  }));
  
  // 6. Générer des tendances d'inscription (simulées)
  const registrationsTrend = months.map((month, index) => ({
    month,
    count: Math.floor(Math.random() * 10) + 5 + (index * 2)
  }));
  
  // 7. Calculer le statut des livres
  const booksStatus = [
    { 
      status: 'Available', 
      count: Math.max(0, totalCopies - borrowedBooks - reservedBooks) 
    },
    { 
      status: 'Borrowed', 
      count: borrowedBooks 
    },
    { 
      status: 'Reserved', 
      count: reservedBooks 
    },
    { 
      status: 'Maintenance', 
      count: Math.floor(totalBooks * 0.02) 
    }
  ];
  
  // 8. Générer des activités récentes (simulées)
  const recentActivity = [
    {
      id: 1,
      type: 'add',
      user: 'Système',
      description: `${totalBooks} livres dans le catalogue`,
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 2,
      type: 'update',
      user: 'Bibliothécaire',
      description: 'Mise à jour des informations de livres',
      timestamp: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 3,
      type: 'borrow',
      user: 'Utilisateur',
      description: 'Emprunt de livre enregistré',
      timestamp: new Date(Date.now() - 10800000).toISOString()
    }
  ];
  
  return {
    stats: {
      totalBooks,
      availableBooks: Math.max(0, totalCopies - borrowedBooks - reservedBooks),
      borrowedBooks,
      reservedBooks,
      pendingReturns,
      lateReturns,
      newRegistrations,
      booksByGenre,
      borrowTrend: monthlyTrend,
      recentActivity,
      lastUpdated: new Date().toISOString()
    },
    booksStatus,
    monthlyTrend,
    registrationsTrend
  };
};

export const bibliothecaireAPI = {
  // Get complete dashboard data (calculé à partir des livres réels)
  getDashboardData: async (): Promise<DashboardData> => {
    try {
      console.log('Calculating dashboard data from real books...');
      
      // Récupérer tous les livres depuis votre API existante
      const books = await LivreAPI.getAll();
      
      // Calculer les statistiques à partir des livres
      const dashboardData = calculateStatsFromBooks(books);
      
      return dashboardData;
    } catch (error) {
      console.error('Error calculating dashboard data from books:', error);
      
      // Retourner des données minimales en cas d'erreur
      return {
        stats: {
          totalBooks: 0,
          availableBooks: 0,
          borrowedBooks: 0,
          reservedBooks: 0,
          pendingReturns: 0,
          lateReturns: 0,
          newRegistrations: 0,
          booksByGenre: [],
          borrowTrend: [],
          recentActivity: [],
          lastUpdated: new Date().toISOString()
        },
        booksStatus: [],
        monthlyTrend: [],
        registrationsTrend: []
      };
    }
  },

  // Get dashboard statistics
  getDashboardStats: async (): Promise<BiblioStats> => {
    try {
      const books = await LivreAPI.getAll();
      const dashboardData = calculateStatsFromBooks(books);
      return dashboardData.stats;
    } catch (error) {
      console.error('Error calculating stats:', error);
      throw new Error(`Impossible de calculer les statistiques: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  },

  // Get books status distribution
  getBooksStatus: async (): Promise<BookStatusData[]> => {
    try {
      const books = await LivreAPI.getAll();
      const dashboardData = calculateStatsFromBooks(books);
      return dashboardData.booksStatus;
    } catch (error) {
      console.error('Error calculating books status:', error);
      throw new Error(`Impossible de calculer le statut des livres: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  },

  // Get monthly borrowing trend (simulé pour l'exemple)
  getMonthlyBorrowingTrend: async (): Promise<MonthlyTrendData[]> => {
    try {
      const books = await LivreAPI.getAll();
      const dashboardData = calculateStatsFromBooks(books);
      return dashboardData.monthlyTrend;
    } catch (error) {
      console.error('Error calculating monthly trend:', error);
      throw new Error(`Impossible de calculer les tendances mensuelles: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  },

  // Get new registrations trend (simulé pour l'exemple)
  getNewRegistrationsTrend: async (): Promise<RegistrationTrendData[]> => {
    try {
      const books = await LivreAPI.getAll();
      const dashboardData = calculateStatsFromBooks(books);
      return dashboardData.registrationsTrend;
    } catch (error) {
      console.error('Error calculating registrations:', error);
      throw new Error(`Impossible de calculer les tendances d'inscription: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  },

  // Generate monthly report (simulé)
  generateMonthlyReport: async (
    month?: number, 
    year?: number, 
    format: 'pdf' | 'excel' = 'pdf'
  ): Promise<{ success: boolean; message: string; url?: string }> => {
    try {
      const books = await LivreAPI.getAll();
      const totalBooks = books.length;
      
      return {
        success: true,
        message: `Rapport mensuel généré pour ${totalBooks} livres`,
        url: undefined
      };
    } catch (error) {
      console.error('Error generating report:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Échec de la génération du rapport',
      };
    }
  },

  // Export loans to CSV (simulé)
  exportLoansToCSV: async (filters?: ExportFilters): Promise<Blob> => {
    try {
      const books = await LivreAPI.getAll();
      
      // Générer un CSV simulé basé sur les livres
      let csvContent = 'ID,Titre,Auteur,Genre,Date Emprunt,Date Retour,Statut\n';
      
      books.slice(0, 10).forEach((book, index) => {
        const borrowDate = new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000);
        const dueDate = new Date(borrowDate.getTime() + 14 * 24 * 60 * 60 * 1000);
        
        csvContent += `${book.idLivre},"${book.titre}","${book.auteur || ''}","${book.genre || ''}",${borrowDate.toISOString().split('T')[0]},${dueDate.toISOString().split('T')[0]},Emprunté\n`;
      });
      
      return new Blob([csvContent], { type: 'text/csv' });
    } catch (error) {
      console.error('Error exporting loans:', error);
      throw new Error(`Impossible d'exporter les emprunts: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  },

  // Export books to CSV (avec les vrais livres)
  exportBooksToCSV: async (filters?: Omit<ExportFilters, 'status'>): Promise<Blob> => {
    try {
      const books = await LivreAPI.getAll();
      
      // Générer le CSV avec les vrais livres
      let csvContent = 'ID,Titre,Auteur,ISBN,Genre,Pages,Chapitres,Exemplaires Totaux\n';
      
      books.forEach(book => {
        csvContent += `${book.idLivre},"${book.titre}","${book.auteur || ''}",${book.isbn},"${book.genre || ''}",${book.numPages || ''},${book.numChapters || ''},${book.numTotalLivres || 1}\n`;
      });
      
      return new Blob([csvContent], { type: 'text/csv' });
    } catch (error) {
      console.error('Error exporting books:', error);
      throw new Error(`Impossible d'exporter le catalogue: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  },

  // Get recent activities (simulé)
  getRecentActivities: async (limit: number = 10): Promise<RecentActivity[]> => {
    try {
      const books = await LivreAPI.getAll();
      const dashboardData = calculateStatsFromBooks(books);
      return dashboardData.stats.recentActivity.slice(0, limit);
    } catch (error) {
      console.error('Error getting recent activities:', error);
      throw new Error(`Impossible de récupérer les activités récentes: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  },

  // Refresh dashboard data
  refreshDashboard: async (): Promise<DashboardData> => {
    try {
      console.log('Refreshing dashboard data...');
      const books = await LivreAPI.getAll();
      return calculateStatsFromBooks(books);
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      throw new Error(`Impossible de rafraîchir le tableau de bord: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  },

  // Vérifier la santé de l'API
  healthCheck: async (): Promise<{ healthy: boolean; message: string; timestamp: string }> => {
    try {
      const books = await LivreAPI.getAll();
      
      return {
        healthy: true,
        message: `API is responsive with ${books.length} books`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        healthy: false,
        message: error instanceof Error ? error.message : 'API is not responsive',
        timestamp: new Date().toISOString(),
      };
    }
  },

  // Obtenir des statistiques rapides
  getQuickStats: async (): Promise<{
    totalBooks: number;
    availableBooks: number;
    borrowedBooks: number;
    lateReturns: number;
  }> => {
    try {
      const books = await LivreAPI.getAll();
      const dashboardData = calculateStatsFromBooks(books);
      
      return {
        totalBooks: dashboardData.stats.totalBooks,
        availableBooks: dashboardData.stats.availableBooks,
        borrowedBooks: dashboardData.stats.borrowedBooks,
        lateReturns: dashboardData.stats.lateReturns,
      };
    } catch (error) {
      console.error('Error fetching quick stats:', error);
      throw new Error(`Impossible de récupérer les statistiques rapides: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  },
};

// Les fonctions utilitaires restent les mêmes
export const formatActivityDate = (timestamp: string | Date): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
  if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
};

export const getActivityIcon = (type: string): string => {
  const icons: Record<string, string> = {
    'borrow': '📚',
    'return': '✅',
    'reserve': '🔖',
    'add': '➕',
    'update': '✏️',
    'renew': '🔄',
    'late': '⏰',
    'register': '👤',
    'delete': '🗑️',
    'report': '📊',
    'login': '🔑',
    'logout': '🚪',
    'default': '📝',
  };
  
  return icons[type] || icons.default;
};

export const getGenreColor = (genre: string): string => {
  const colors: Record<string, string> = {
    'Roman': '#FFD166',
    'Science-Fiction': '#FF9B54',
    'Fantastique': '#9C5149',
    'Historique': '#4CAF50',
    'Policier': '#2196F3',
    'Biographie': '#FF6B6B',
    'Poésie': '#9C27B0',
    'Théâtre': '#00BCD4',
    'Jeunesse': '#FF9800',
    'Essai': '#795548',
    'Manga': '#E91E63',
    'Bande Dessinée': '#3F51B5',
    'Fiction': '#FFD166',
    'Literary Criticism': '#9C5149',
    'Language Arts & Disciplines': '#4CAF50',
    'Islam and culture': '#2196F3',
    'default': '#8884d8',
  };
  
  return colors[genre] || colors.default;
};

export const getGenreIcon = (genre: string): string => {
  const icons: Record<string, string> = {
    'Roman': '📖',
    'Science-Fiction': '🚀',
    'Fantastique': '🐉',
    'Historique': '🏛️',
    'Policier': '🔍',
    'Biographie': '👤',
    'Poésie': '✍️',
    'Théâtre': '🎭',
    'Jeunesse': '🧸',
    'Essai': '📝',
    'Manga': '🇯🇵',
    'Bande Dessinée': '🖼️',
    'Fiction': '📚',
    'Literary Criticism': '📖',
    'Language Arts & Disciplines': '🗣️',
    'Islam and culture': '🕌',
    'default': '📚',
  };
  
  return icons[genre] || icons.default;
};

export default bibliothecaireAPI;
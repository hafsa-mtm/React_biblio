export interface Book {
  idLivre: number;
  titre: string;
  isbn: string;
  auteur?: string;
  genre?: string;
  numChapters?: number;
  numPages?: number;
  numTotalLivres: number;
  image?: string;      
  synopsis?: string;    
}

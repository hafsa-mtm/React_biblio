import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Catalog from '../pages/shared/Catalog';
import BookDetails from '../pages/shared/BookDetails'; 
import AllBooks from '../pages/bibliothecaire/AllBooks';
import BiblioDashboard from '../pages/bibliothecaire/BiblioDashboard';
import AddBook from '../pages/bibliothecaire/AddBook';
import EditBook from '../pages/bibliothecaire/EditBook';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/livres/:id" element={<BookDetails />} />
        <Route path="/biblio/livres" element={<AllBooks />} />
        <Route path="/biblio" element={<BiblioDashboard />} />
        <Route path="/biblio/livres/ajouter" element={<AddBook />} />
        <Route path="/biblio/livres/:id/modifier" element={<EditBook />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

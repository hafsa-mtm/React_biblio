import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Catalog from '../pages/shared/Catalog';
import BookDetails from '../pages/shared/BookDetails'; 
import AllBooks from '../pages/bibliothecaire/AllBooks';
import BiblioDashboard from '../pages/bibliothecaire/BiblioDashboard';
import AddBook from '../pages/bibliothecaire/AddBook';
import EditBook from '../pages/bibliothecaire/EditBook';
import PretManagement from '../pages/bibliothecaire/PretManagement';
// Import other necessary pages

// Create simple placeholder components for now
const LecteurManagement = () => <div>Gestion des Lecteurs - Page en construction</div>;
const RetourManagement = () => <div>Gestion des Retours - Page en construction</div>;
const Analytiques = () => <div>Analytiques - Page en construction</div>;
const Profile = () => <div>Profil - Page en construction</div>;

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/livres/:id" element={<BookDetails />} />
        
        {/* Bibliothecaire Routes */}
        <Route path="/biblio" element={<BiblioDashboard />} />
        <Route path="/biblio/livres" element={<AllBooks />} />
        <Route path="/biblio/livres/ajouter" element={<AddBook />} />
        <Route path="/biblio/livres/:id/modifier" element={<EditBook />} />
        <Route path="/biblio/prets" element={<PretManagement />} />
        
        {/* Add other routes for these pages */}
        <Route path="/biblio/lecteurs" element={<LecteurManagement />} />
        <Route path="/biblio/retours" element={<RetourManagement />} />
        <Route path="/biblio/analytiques" element={<Analytiques />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
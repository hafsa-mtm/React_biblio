import { Routes, Route } from "react-router-dom";
import Catalog from "../pages/shared/Catalog";
import BookDetails from "../pages/shared/BookDetails";
import Login from "../pages/shared/Login";
import Home from "../pages/shared/Home"; // Fixed import name (lowercase h to uppercase)

import BiblioDashboard from "../pages/bibliothecaire/BiblioDashboard";
import AllBooks from "../pages/bibliothecaire/AllBooks";
import AddBook from "../pages/bibliothecaire/AddBook";
import EditBook from "../pages/bibliothecaire/EditBook";
import PretManagement from "../pages/bibliothecaire/PretManagement";

import LecteurDashboard from "../pages/lecteur/LecteurDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import RegisterLecteur from "../pages/shared/Register";
import UserManagement from "../pages/admin/UserManagement";
import CreateUser from "../pages/admin/CreateUser";
import ProtectedRoute from "../auth/ProtectedRoute";
import EditUser from "../pages/admin/EditUser";

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Home />} /> {/* Home page as default */}
      <Route path="/login" element={<Login />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/livres/:id" element={<BookDetails />} />
      <Route path="/register" element={<RegisterLecteur />} />
      
      {/* VISITOR ROUTES */}
      <Route path="/about" element={<Catalog />} /> {/* Placeholder - update when you have About page */}
      <Route path="/contact" element={<Catalog />} /> {/* Placeholder - update when you have Contact page */}
      <Route path="/members" element={<Catalog />} /> {/* Placeholder - update when you have Members page */}

      {/* LECTEUR */}
      <Route
        path="/lecteur"
        element={
          <ProtectedRoute roles={["LECTEUR"]}>
            <LecteurDashboard />
          </ProtectedRoute>
        }
      />

      {/* BIBLIOTHÉCAIRE */}
      <Route
        path="/biblio"
        element={
          <ProtectedRoute roles={["BIBLIOTHECAIRE"]}>
            <BiblioDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/biblio/livres"
        element={
          <ProtectedRoute roles={["BIBLIOTHECAIRE"]}>
            <AllBooks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/biblio/livres/ajouter"
        element={
          <ProtectedRoute roles={["BIBLIOTHECAIRE"]}>
            <AddBook />
          </ProtectedRoute>
        }
      />
      <Route
        path="/biblio/livres/:id/modifier"
        element={
          <ProtectedRoute roles={["BIBLIOTHECAIRE"]}>
            <EditBook />
          </ProtectedRoute>
        }
      />
      <Route
        path="/biblio/prets"
        element={
          <ProtectedRoute roles={["BIBLIOTHECAIRE"]}>
            <PretManagement />
          </ProtectedRoute>
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/create"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <CreateUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/:role/:id/edit"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <EditUser />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
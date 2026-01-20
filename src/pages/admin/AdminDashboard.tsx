import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Administrateur</h1>
      
      {/* Ligne simple */}
      <div className="border p-4 mb-4">
        <span className="font-medium">Nom de l'utilisateur :</span> Admin
      </div>
            <Link
        to="/admin/users"
        className="text-blue-600 underline"
      >
        Gérer les utilisateurs
      </Link>
    </div>
  );
};

export default AdminDashboard;
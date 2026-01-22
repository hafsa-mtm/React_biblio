import React, { useEffect, useState } from "react";
import { AdminAPI } from "../../api/admin.api";
import { User } from "../../types/User";
import { Link } from "react-router-dom";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    AdminAPI.getAllUsers()
      .then(data => {
        console.log("Users fetched:", data); // 🔹 debug
        setUsers(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, role: User["role"]) => {
    if (!id) return;
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;

    try {
      await AdminAPI.deleteUser(id, role);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err: any) {
      console.error(err);
      alert("Erreur lors de la suppression : " + (err.response?.data?.message || err.message));
    }
  };

  const filteredUsers = users.filter(u =>
    `${u.nom} ${u.prenom} ${u.email} ${u.role}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="p-6">Chargement...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        <Link to="/admin/users/create" className="bg-green-600 text-white px-4 py-2 rounded">
          + Nouvel utilisateur
        </Link>
      </div>

      <input
        type="text"
        placeholder="Rechercher par nom, prénom, email ou rôle"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border p-2 mb-4 w-full rounded"
      />

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Nom</th>
            <th className="border p-2">Prénom</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Date de naissance</th>
            <th className="border p-2">Rôle</th>
            <th className="border p-2">Créé le</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(u => (
              <tr key={u.id} className="text-center">
                <td className="border p-2">{u.nom}</td>
                <td className="border p-2">{u.prenom}</td>
                <td className="border p-2">{u.email}</td>
                <td className="border p-2">{u.date_naissance ? new Date(u.date_naissance).toLocaleDateString() : "-"}</td>
                <td className="border p-2 font-semibold">{u.role}</td>
                <td className="border p-2">{u.created_at ? new Date(u.created_at).toLocaleDateString() : "-"}</td>
                <td className="border p-2 space-x-2">
                  <Link
                    to={`/admin/users/${u.role.toLowerCase()}/${u.id}/edit`}
                    className="text-blue-600 underline"
                  >
                    Modifier
                  </Link>
                  <button onClick={() => handleDelete(u.id, u.role)} className="text-red-600 underline">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center p-4">
                Aucun utilisateur trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
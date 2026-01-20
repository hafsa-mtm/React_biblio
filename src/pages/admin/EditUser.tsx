import React, { useEffect, useState } from "react";
import { AdminAPI } from "../../api/admin.api";
import { useNavigate, useParams } from "react-router-dom";

const EditUser = () => {
  const { id, role } = useParams<{
    id: string;
    role: "admin" | "bibliothecaire" | "lecteur";
  }>();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    date_naissance: "",
    role: "LECTEUR",
  });

 useEffect(() => {
  if (!id || !role) return;

  const fetchUser = async () => {
    try {
      const user = await AdminAPI.getUserById(
        id,
        role.toUpperCase() as any
      );

      setForm({
        nom: user.nom || "",
        prenom: user.prenom || "",
        email: user.email || "",
        password: "",
        date_naissance: user.date_naissance || "",
        role: user.role,
      });
    } catch {
      alert("Impossible de charger l'utilisateur");
      navigate("/admin/users");
    }
  };

  fetchUser();
}, [id, role, navigate]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const currentRole = role!.toUpperCase() as
      | "ADMIN"
      | "BIBLIOTHECAIRE"
      | "LECTEUR";

    if (form.role !== currentRole) {
      // 🔁 changement de rôle
      await AdminAPI.changeUserRole({
        id: id!,
        oldRole: currentRole,
        newRole: form.role as any,
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        date_naissance: form.date_naissance,
        password: form.password,
      });
    } else {
      // simple update
      await AdminAPI.updateUser(
        id!,
        currentRole,
        {
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          date_naissance: form.date_naissance,
          password: form.password || undefined,
        }
      );
    }

    navigate("/admin/users");
  } catch {
    alert("Erreur lors de la modification");
  }
};

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Modifier l'utilisateur
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="nom"
          value={form.nom}
          onChange={handleChange}
          className="w-full border p-2"
        />

        <input
          name="prenom"
          value={form.prenom}
          onChange={handleChange}
          className="w-full border p-2"
        />

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2"
        />

        <input
          name="password"
          type="password"
          placeholder="Nouveau mot de passe (optionnel)"
          onChange={handleChange}
          className="w-full border p-2"
        />

        <input
            type="date"
            name="date_naissance"
            value={form.date_naissance}
            onChange={handleChange}
            className="w-full border p-2"
        />

        <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border p-2"
            >
            <option value="LECTEUR">Lecteur</option>
            <option value="BIBLIOTHECAIRE">Bibliothécaire</option>
            <option value="ADMIN">Admin</option>
        </select>


        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default EditUser;
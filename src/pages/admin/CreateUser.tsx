import React, { useState } from "react";
import { AdminAPI } from "../../api/admin.api";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    date_naissance: "",
    role: "LECTEUR",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await AdminAPI.createUser(form as any);
      navigate("/admin/users");
    } catch (err) {
      alert("Erreur lors de la création de l'utilisateur");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Créer un utilisateur</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="nom"
          placeholder="Nom"
          onChange={handleChange}
          className="w-full border p-2"
          required
        />

        <input
          name="prenom"
          placeholder="Prénom"
          onChange={handleChange}
          className="w-full border p-2"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border p-2"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          onChange={handleChange}
          className="w-full border p-2"
          required
        />

        <input
            type="date"
            name="date_naissance"
            onChange={handleChange}
            className="w-full border p-2"
            required
        />

        <select
          name="role"
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
          Créer
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
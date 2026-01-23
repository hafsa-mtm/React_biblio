import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { PretAPI } from "../../api/pret.api";

const ProlongerPrete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dateFin, setDateFin] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await PretAPI.prolongerPrete(Number(id), dateFin);
      alert("Prêt prolongé avec succès");
      navigate("/biblio/pretes-actifs");
    } catch (e) {
      alert("Erreur lors de la prolongation");
    }
  };

  return (
    <div className="p-8 max-w-md">
      <h1 className="text-xl font-bold mb-4">Prolonger le prêt</h1>

      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Nouvelle date de fin</label>
        <input
          type="date"
          value={dateFin}
          onChange={(e) => setDateFin(e.target.value)}
          required
          className="border p-2 w-full mb-4"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Prolonger
        </button>
      </form>
    </div>
  );
};

export default ProlongerPrete;
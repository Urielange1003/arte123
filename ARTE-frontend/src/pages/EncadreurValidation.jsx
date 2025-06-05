import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EncadreurValidation = () => {
  const [stagiaires, setStagiaires] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStagiaires = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:8000/api/encadreur/stagiaires', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStagiaires(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des stagiaires :", error);
      }
    };

    fetchStagiaires();
  }, []);

  const handleValidation = async (id, formData) => {
    const token = localStorage.getItem('token');
    setLoading(true);

    try {
      const response = await axios.put(
        `http://localhost:8000/api/encadreur/stagiaire/${id}/valider-documents`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message || "Documents validés !");
    } catch (error) {
      alert(error.response?.data?.message || "Erreur lors de la validation !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Validation des documents</h2>
      {stagiaires.map((stagiaire) => (
        <div key={stagiaire.id} className="border p-4 mb-4 rounded">
          <h3 className="font-semibold">{stagiaire.name}</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = {
                rapport_valide: e.target.rapport.checked,
                badge_remis: e.target.badge.checked,
                presence_complete: e.target.presence.checked,
              };
              handleValidation(stagiaire.id, formData);
            }}
          >
            <label className="block">
              <input type="checkbox" name="rapport" /> Rapport validé
            </label>
            <label className="block">
              <input type="checkbox" name="badge" /> Badge remis
            </label>
            <label className="block">
              <input type="checkbox" name="presence" /> Présence complète
            </label>
            <button
              type="submit"
              className={`mt-2 bg-green-600 text-white px-4 py-2 rounded ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
              }`}
              disabled={loading}
            >
              {loading ? "Validation en cours..." : "Valider les documents"}
            </button>
          </form>
        </div>
      ))}
    </div>
  );
};

export default EncadreurValidation;

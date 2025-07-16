import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function ValidationDocuments({ stagiaire }) {
  const [checklist, setChecklist] = useState({
    rapport: false,
    badgeRendu: false,
    presenceComplete: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setChecklist({
      ...checklist,
      [e.target.name]: e.target.checked,
    });
  };

  const allChecked = Object.values(checklist).every((val) => val);

  const valider = async () => {
    if (!allChecked) {
      setMessage("❌ Veuillez cocher toutes les cases avant validation.");
      return;
    }

    setLoading(true);
    try {
      await api.post(`/rh/valider-fin-stage/${stagiaire.id}`, checklist);
      setMessage("✅ Validation envoyée avec succès !");
    } catch (error) {
      console.error("Erreur d'envoi :", error);
      setMessage("❌ Erreur lors de l'envoi.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md max-w-md mx-auto text-center">
      <h4 className="text-xl font-semibold mb-4">{stagiaire.nom}</h4>
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="rapport" onChange={handleChange} />
          Rapport remis
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="badgeRendu" onChange={handleChange} />
          Badge rendu
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="presenceComplete" onChange={handleChange} />
          Présence complète
        </label>
      </div>
      <button
        onClick={valider}
        disabled={loading || !allChecked}
        className={`px-4 py-2 mt-4 text-white rounded-md ${
          loading ? 'bg-gray-400' : allChecked ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300'
        }`}
      >
        {loading ? "Validation en cours..." : "Valider et Générer Attestation"}
      </button>
      {message && <p className="mt-3 text-gray-700">{message}</p>}
    </div>
  );
}

export default ValidationDocuments;

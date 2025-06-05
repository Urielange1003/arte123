import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ValidationDocuments from '../components/RH/ValidationDocuments';

function ValidationFinStage() {
  const [stagiaires, setStagiaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStagiaires = async () => {
      try {
        const res = await api.get('/rh/stagiaires-fin-stage');
        setStagiaires(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des stagiaires :", err);
        setError("❌ Impossible de récupérer la liste des stagiaires.");
      } finally {
        setLoading(false);
      }
    };

    loadStagiaires();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">Validation de fin de stage - RH</h2>

      {loading ? (
        <p className="text-center text-gray-600">Chargement des stagiaires...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : stagiaires.length === 0 ? (
        <p className="text-center text-gray-500">Aucun stagiaire à traiter</p>
      ) : (
        <div className="space-y-4">
          {stagiaires.map((s) => (
            <ValidationDocuments key={s.id} stagiaire={s} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ValidationFinStage;

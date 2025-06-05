import React, { useEffect, useState } from 'react';
import api from '../../services/api';

function TachesDuJour() {
  const [taches, setTaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTaches = async () => {
      try {
        const res = await api.get('/stagiaire/taches');
        setTaches(res.data);
      } catch (err) {
        console.error("Erreur de récupération des tâches :", err);
        setError("❌ Impossible de récupérer les tâches du jour.");
      } finally {
        setLoading(false);
      }
    };

    fetchTaches();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md max-w-md mx-auto text-center">
      <h3 className="text-xl font-semibold mb-4">Tâches du jour</h3>

      {loading ? (
        <p className="text-gray-600">Chargement des tâches...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : taches.length === 0 ? (
        <p className="text-gray-500">Aucune tâche assignée aujourd’hui.</p>
      ) : (
        <ul className="space-y-2 text-left">
          {taches.map((tache, i) => (
            <li key={i} className="p-2 bg-white shadow-sm rounded-md">{tache.description}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TachesDuJour;

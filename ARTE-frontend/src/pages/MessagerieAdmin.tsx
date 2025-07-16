import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ChatAdmin from '../components/Messaging/ChatAdmin';

function MessagerieAdmin() {
  const [stagiaires, setStagiaires] = useState([]);
  const [stagiaireId, setStagiaireId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStagiaires = async () => {
      try {
        const res = await api.get('/admin/stagiaires');
        setStagiaires(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des stagiaires :", err);
        setError("Impossible de récupérer la liste des stagiaires.");
      } finally {
        setLoading(false);
      }
    };

    fetchStagiaires();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">Messagerie Admin / RH</h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="max-w-md mx-auto">
        <select
          className="w-full p-2 border rounded-md"
          onChange={(e) => setStagiaireId(e.target.value)}
          disabled={loading}
        >
          <option value="">Choisir un stagiaire</option>
          {stagiaires.map((s) => (
            <option key={s.id} value={s.id}>{s.nom}</option>
          ))}
        </select>
      </div>

      {stagiaireId && <ChatAdmin stagiaireId={stagiaireId} />}
    </div>
  );
}

export default MessagerieAdmin;

import React, { useState } from 'react';
import api from '../../services/api';

function PresenceForm() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await api.post('/stagiaire/presence');
      setStatus('Présence marquée avec succès ✅');
    } catch (error) {
      console.error('Erreur API :', error);
      setStatus("❌ Erreur lors de l'enregistrement");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md text-center">
      <h3 className="text-xl font-semibold mb-4">Marquer ma présence</h3>
      <button
        onClick={handleCheckIn}
        disabled={loading}
        className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
      >
        {loading ? 'Enregistrement...' : "Je suis présent aujourd'hui"}
      </button>
      {status && <p className="mt-3 text-gray-700">{status}</p>}
    </div>
  );
}

export default PresenceForm;

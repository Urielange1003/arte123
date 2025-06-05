import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function PresenceJournal() {
  const [estPresent, setEstPresent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkPresence = async () => {
      try {
        const res = await api.get('/stagiaire/presence/aujourdhui');
        setEstPresent(res.data.present);
      } catch (error) {
        console.error("Erreur lors de la vérification de présence :", error);
      }
    };
    checkPresence();
  }, []);

  const cocherPresence = async () => {
    if (estPresent) return;

    setLoading(true);
    try {
      await api.post('/stagiaire/presence');
      setEstPresent(true);
      setMessage("✅ Présence validée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la validation de présence :", error);
      setMessage("❌ Une erreur s'est produite.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md max-w-md mx-auto text-center">
      <h3 className="text-xl font-semibold mb-4">Présence du jour</h3>
      {estPresent ? (
        <p className="text-green-600 font-semibold">Vous avez déjà validé votre présence aujourd'hui ✅</p>
      ) : (
        <button
          onClick={cocherPresence}
          disabled={loading}
          className={`px-4 py-2 text-white rounded-md ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Validation en cours...' : 'Valider ma présence'}
        </button>
      )}
      {message && <p className="mt-3 text-gray-700">{message}</p>}
    </div>
  );
}

export default PresenceJournal;

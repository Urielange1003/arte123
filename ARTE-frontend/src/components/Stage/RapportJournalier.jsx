import React, { useState } from 'react';
import api from '../../services/api';

function RapportJournalier() {
  const [texte, setTexte] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!texte.trim()) {
      setMessage("❌ Le rapport ne peut pas être vide.");
      return;
    }

    setLoading(true);
    try {
      await api.post('/stagiaire/rapport-journalier', { contenu: texte });
      setMessage('✅ Rapport enregistré avec succès.');
      setTexte('');
    } catch (err) {
      console.error('Erreur API :', err);
      setMessage("❌ Erreur lors de la sauvegarde.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md max-w-md mx-auto text-center">
      <h3 className="text-xl font-semibold mb-4">Rapport journalier</h3>
      <textarea
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        placeholder="Décrivez votre journée de stage..."
        className="w-full p-2 border rounded-md"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`px-4 py-2 mt-2 text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        {loading ? 'Enregistrement...' : 'Soumettre'}
      </button>
      {message && <p className="mt-3 text-gray-700">{message}</p>}
    </div>
  );
}

export default RapportJournalier;

import React, { useState } from 'react';
import api from '../../services/api';

function RapportFinalUploader() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = '';
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setMessage('❌ Veuillez sélectionner un fichier.');
      return;
    }

    const formData = new FormData();
    formData.append('rapport', file);

    setLoading(true);
    try {
      await api.post('/stagiaire/rapport-final', formData);
      setMessage('✅ Rapport envoyé avec succès.');
      setFile(null); // Réinitialisation après l'envoi réussi
    } catch (error) {
      console.error('Erreur lors de l\'envoi :', error);
      setMessage('❌ Erreur lors de l’envoi.');
    }
    setLoading(false);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md max-w-md mx-auto text-center">
      <h3 className="text-xl font-semibold mb-4">Rapport de fin de stage</h3>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-2 p-2 border rounded-md w-full"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className={`px-4 py-2 mt-2 text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
      >
        {loading ? 'Envoi en cours...' : 'Uploader'}
      </button>
      {message && <p className="mt-3 text-gray-700">{message}</p>}
    </div>
  );
}

// ✅ Export unique et correct
export default RapportFinalUploader;

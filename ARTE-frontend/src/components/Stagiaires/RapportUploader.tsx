import React, { useState } from 'react';
import api from '../../services/api';

function RapportUploader() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!file) {
      setMessage("❌ Veuillez sélectionner un fichier avant d'envoyer.");
      return;
    }

    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setMessage("❌ Seuls les fichiers PDF sont autorisés.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('rapport', file);

    try {
      await api.post('/stagiaire/rapport', formData);
      setMessage("✅ Rapport envoyé avec succès !");
      setFile(null);
    } catch (error) {
      console.error("Erreur d'envoi :", error);
      setMessage("❌ Erreur lors de l'envoi du rapport.");
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
        onClick={handleSubmit}
        disabled={loading}
        className={`px-4 py-2 mt-2 text-white rounded-md ${
          loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {loading ? "Envoi en cours..." : "Envoyer le rapport"}
      </button>
      {message && <p className="mt-3 text-gray-700">{message}</p>}
    </div>
  );
}

export default RapportUploader;

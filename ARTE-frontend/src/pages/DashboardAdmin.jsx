import React, { useEffect, useState } from 'react';
import api from '../services/api';

function DashboardAdmin() {
  const [stagiaires, setStagiaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null); // Gestion du chargement pour chaque stagiaire

  useEffect(() => {
    const fetchStagiaires = async () => {
      try {
        const res = await api.get('/admin/stagiaires');
        setStagiaires(res.data);
      } catch (err) {
        setError('❌ Erreur lors de la récupération des stagiaires.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStagiaires();
  }, []);

  const handleViewDetails = (stagiaire) => {
    alert(`Afficher détails du dossier pour ${stagiaire.user.name}`);
    // Ici, on pourrait naviguer vers une page détaillée ou ouvrir un modal.
  };

  const handleValidateStage = async (stagiaireId) => {
    setProcessingId(stagiaireId);
    try {
      await api.post(`/admin/stagiaires/${stagiaireId}/validate`);
      alert('✅ Stage validé avec succès !');
      setStagiaires((prev) =>
        prev.map((s) =>
          s.id === stagiaireId ? { ...s, stage: { ...s.stage, statut: 'validé' } } : s
        )
      );
    } catch (error) {
      alert('❌ Erreur lors de la validation du stage.');
    }
    setProcessingId(null);
  };

  if (loading) return <p className="text-center text-gray-500">Chargement...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-100 shadow-md rounded-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Dashboard Admin / RH</h2>
      <h3 className="text-lg font-semibold mb-2">Liste des stagiaires</h3>

      {stagiaires.length === 0 ? (
        <p className="text-gray-500 text-center">Aucun stagiaire trouvé.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-md">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-2">ID</th>
                <th className="p-2">Nom</th>
                <th className="p-2">Email</th>
                <th className="p-2">Statut Dossier</th>
                <th className="p-2">Statut Stage</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stagiaires.map((stagiaire) => (
                <tr key={stagiaire.id} className="border-t">
                  <td className="p-2">{stagiaire.id}</td>
                  <td className="p-2">{stagiaire.user.name}</td>
                  <td className="p-2">{stagiaire.user.email}</td>
                  <td className="p-2">
                    {stagiaire.dossier ? stagiaire.dossier.statut : 'N/A'}
                  </td>
                  <td className="p-2">
                    {stagiaire.stage ? stagiaire.stage.statut : 'N/A'}
                  </td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => handleViewDetails(stagiaire)}
                      className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                      Voir Détails
                    </button>
                    <button
                      onClick={() => handleValidateStage(stagiaire.id)}
                      disabled={processingId === stagiaire.id}
                      className={`px-4 py-2 text-white rounded-md ${
                        processingId === stagiaire.id ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      {processingId === stagiaire.id ? 'Validation...' : 'Valider Stage'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DashboardAdmin;

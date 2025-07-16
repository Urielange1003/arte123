// src/pages/Admin/InternshipDetailsPage.tsx (Exemple)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Download, UserCheck } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { fetchApi } from '../../services/api';

interface StagiaireDetails {
  id: number;
  name: string;
  email: string;
  role: string;
  // Ajoutez d'autres champs pertinents pour le stage
  startDate: string;
  endDate: string;
  department: string;
  // ...
}

const InternshipDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Récupère l'ID du stage/stagiaire depuis l'URL
  const navigate = useNavigate();
  const [stagiaire, setStagiaire] = useState<StagiaireDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [isLoadingDownload, setIsLoadingDownload] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStagiaireDetails = async () => {
      try {
        // Cette route '/api/user/{id}' n'existe pas encore dans votre Laravel,
        // vous devrez la créer ou adapter. Pour l'exemple, supposons que c'est l'ID de l'utilisateur.
        // Mieux serait d'avoir '/api/internships/{id}' pour récupérer les détails du stage.
        const response = await fetchApi(`user/${id}`); // Adapter si vous avez une route pour les stages
        setStagiaire(response); // La réponse de l'API est l'objet utilisateur
      } catch (err) {
        setError("Impossible de charger les détails du stagiaire.");
        console.error("Erreur lors du chargement des détails:", err);
      } finally {
        setIsLoadingDetails(false);
      }
    };

    if (id) {
      fetchStagiaireDetails();
    }
  }, [id]);

  const handleDownloadDocument = async (documentType: 'letter' | 'certificate') => {
    setIsLoadingDownload(true);
    setError(null);

    if (!stagiaire) {
      setError("Détails du stagiaire non disponibles.");
      setIsLoadingDownload(false);
      return;
    }

    try {
      const endpoint = documentType === 'letter'
        ? `internships/${stagiaire.id}/generate-letter`
        : `internships/${stagiaire.id}/generate-certificate`;

      // Utilisation de fetch classique ici car fetchApi s'attend à du JSON,
      // mais nous voulons récupérer un blob (fichier PDF).
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error("Non authentifié pour le téléchargement.");
        navigate('/login');
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api/${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/pdf', // Indique que nous attendons un PDF
        },
      });

      if (!response.ok) {
        const errorText = await response.text(); // Lire le texte de l'erreur pour un débogage
        console.error(`Erreur ${response.status} lors de la génération du document:`, errorText);
        let errorMessage = 'Impossible de générer le document.';
        try {
          const errorJson = JSON.parse(errorText); // Tente de parser en JSON si le backend renvoie JSON
          errorMessage = errorJson.message || errorMessage;
        } catch (e) {
          // Ce n'était pas du JSON, utiliser le texte brut
        }
        setError(errorMessage);
        return;
      }

      // La réponse est un fichier PDF (Blob)
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Définir le nom du fichier à télécharger (Laravel le fournit aussi dans Content-Disposition)
      a.download = `${documentType === 'letter' ? 'Lettre_de_stage' : 'Attestation_fin_de_stage'}_${stagiaire.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Libérer l'URL d'objet

    } catch (err) {
      console.error('Erreur réseau ou du serveur lors du téléchargement:', err);
      setError('Une erreur inattendue est survenue lors du téléchargement.');
    } finally {
      setIsLoadingDownload(false);
    }
  };


  if (isLoadingDetails) {
    return <div className="text-center py-20 dark:text-white">Chargement des détails du stagiaire...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-danger-600 dark:text-danger-400">Erreur : {error}</p>
        <Button onClick={() => navigate(-1)} className="mt-4">Retour</Button>
      </div>
    );
  }

  if (!stagiaire) {
    return <div className="text-center py-20 dark:text-white">Stagiaire non trouvé.</div>;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 pt-24 pb-20 min-h-screen flex justify-center">
      <div className="max-w-xl w-full px-4 sm:px-6 lg:px-8">
        <Card variant="elevated" padding="lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Détails du Stagiaire</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Informations et documents pour {stagiaire.name}
            </p>
          </div>

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p><strong>Nom :</strong> {stagiaire.name}</p>
            <p><strong>Email :</strong> {stagiaire.email}</p>
            <p><strong>Rôle :</strong> {stagiaire.role}</p>
            {/* Affichez plus de détails sur le stage si vous les avez */}
            <p><strong>Début de stage :</strong> {stagiaire.startDate || 'N/A'}</p>
            <p><strong>Fin de stage :</strong> {stagiaire.endDate || 'N/A'}</p>
            <p><strong>Département :</strong> {stagiaire.department || 'N/A'}</p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                leftIcon={<Download size={18} />}
                isLoading={isLoadingDownload}
                onClick={() => handleDownloadDocument('letter')}
                disabled={isLoadingDownload}
              >
                Télécharger Lettre de Stage
              </Button>
              <Button
                variant="outline"
                leftIcon={<Download size={18} />}
                isLoading={isLoadingDownload}
                onClick={() => handleDownloadDocument('certificate')}
                disabled={isLoadingDownload}
              >
                Télécharger Attestation
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Retour
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InternshipDetailsPage;
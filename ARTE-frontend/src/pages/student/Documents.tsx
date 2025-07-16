import React, { useEffect, useState } from 'react';
import { FileText, Upload, Download, Eye, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../services/api';

interface DocumentItem {
  id: string;
  title: string;
  type: string;
  size: string;
  date: string;
  status: string;
}

interface DocumentsData {
  official: DocumentItem[];
  reports: DocumentItem[];
  attendance: DocumentItem[];
}

const StudentDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentsData>({
    official: [],
    reports: [],
    attendance: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api.get('/stagiaire/documents')
      .then((res) => setDocuments(res.data))
      .catch(() => setError('Erreur lors du chargement des documents.'))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'signed':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400">
            Signé
          </span>
        );
      case 'approved':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
            Approuvé
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-400">
            En attente
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Documents
        </h1>
        <Button variant="primary" leftIcon={<Upload size={16} />}>
          Téléverser un document
        </Button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-10">Chargement...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : (
        <>
          <Card variant="default">
            <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Documents officiels
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {documents.official.map((doc) => (
                <div key={doc.id} className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-agl-blue" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {doc.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {doc.type}, {doc.size} • {new Date(doc.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(doc.status)}
                    <Button variant="ghost" size="sm" leftIcon={<Download size={16} />}>
                      Télécharger
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="default">
            <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Rapports de stage
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {documents.reports.map((doc) => (
                <div key={doc.id} className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {doc.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {doc.type}, {doc.size} • {new Date(doc.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(doc.status)}
                    <Button variant="ghost" size="sm" leftIcon={<Eye size={16} />}>
                      Voir
                    </Button>
                    <Button variant="ghost" size="sm" leftIcon={<Download size={16} />}>
                      Télécharger
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="default">
            <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Fiches de présence
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {documents.attendance.map((doc) => (
                <div key={doc.id} className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {doc.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {doc.type}, {doc.size} • {new Date(doc.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(doc.status)}
                    <Button variant="ghost" size="sm" leftIcon={<Eye size={16} />}>
                      Voir
                    </Button>
                    <Button variant="ghost" size="sm" leftIcon={<Download size={16} />}>
                      Télécharger
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default StudentDocuments;
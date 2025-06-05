import React from 'react';
import { FileText, Upload, Download, Eye, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const StudentDocuments: React.FC = () => {
  // Mock documents data
  const documents = {
    official: [
      {
        id: 'doc-001',
        title: 'Lettre de stage',
        type: 'PDF',
        size: '2.3 MB',
        date: '2025-01-12',
        status: 'signed'
      },
      {
        id: 'doc-002',
        title: 'Convention de stage',
        type: 'PDF',
        size: '3.1 MB',
        date: '2025-01-15',
        status: 'signed'
      }
    ],
    reports: [
      {
        id: 'doc-003',
        title: 'Rapport de mi-stage',
        type: 'PDF',
        size: '5.2 MB',
        date: '2025-02-28',
        status: 'approved'
      },
      {
        id: 'doc-004',
        title: 'Rapport final',
        type: 'PDF',
        size: '8.7 MB',
        date: '2025-04-10',
        status: 'pending'
      }
    ],
    attendance: [
      {
        id: 'doc-005',
        title: 'Fiche de présence - Janvier',
        type: 'PDF',
        size: '1.8 MB',
        date: '2025-02-01',
        status: 'approved'
      },
      {
        id: 'doc-006',
        title: 'Fiche de présence - Février',
        type: 'PDF',
        size: '1.7 MB',
        date: '2025-03-01',
        status: 'approved'
      },
      {
        id: 'doc-007',
        title: 'Fiche de présence - Mars',
        type: 'PDF',
        size: '1.9 MB',
        date: '2025-04-01',
        status: 'pending'
      }
    ]
  };

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
    </div>
  );
};

export default StudentDocuments;
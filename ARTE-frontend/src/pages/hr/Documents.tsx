import React, { useEffect, useState } from 'react';
import { FileText, Download, Eye, Upload, Search, Filter, CheckCircle, XCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';

interface HRDocument {
  id: string;
  student: string;
  type: string;
  date: string;
  status: string;
  fileSize: string;
  comment?: string;
  category: 'letter' | 'certificate' | 'report';
}

const HRDocuments: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [documents, setDocuments] = useState<HRDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api.get('/hr/documents')
      .then(res => setDocuments(res.data))
      .catch(() => setError('Erreur lors du chargement des documents.'))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'signed':
        return 'bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400';
      case 'pending':
        return 'bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-400';
      case 'approved':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400';
      case 'rejected':
        return 'bg-error-100 dark:bg-error-900/20 text-error-800 dark:text-error-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'signed':
        return 'Signé';
      case 'pending':
        return 'En attente';
      case 'approved':
        return 'Approuvé';
      case 'rejected':
        return 'Rejeté';
      default:
        return status;
    }
  };

  // Filtrage local
  const filteredDocs = documents.filter(doc => {
    const typeMatch = selectedType === 'all' || doc.category === selectedType;
    const statusMatch = selectedStatus === 'all' || doc.status === selectedStatus;
    const searchMatch =
      doc.student.toLowerCase().includes(search.toLowerCase()) ||
      doc.type.toLowerCase().includes(search.toLowerCase()) ||
      doc.id.toLowerCase().includes(search.toLowerCase());
    return typeMatch && statusMatch && searchMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Documents
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" leftIcon={<Download size={18} />}>
            Exporter
          </Button>
          <Button variant="primary" leftIcon={<Upload size={18} />}>
            Nouveau document
          </Button>
        </div>
      </div>

      <Card variant="default">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Rechercher un document..."
              leftIcon={<Search size={18} />}
              fullWidth
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="block w-full rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-agl-blue focus:ring-2 focus:ring-agl-blue/20 py-2.5 px-4"
            >
              <option value="all">Tous les types</option>
              <option value="letter">Lettres de stage</option>
              <option value="certificate">Attestations</option>
              <option value="report">Rapports</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-agl-blue focus:ring-2 focus:ring-agl-blue/20 py-2.5 px-4"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="signed">Signés</option>
              <option value="approved">Approuvés</option>
              <option value="rejected">Rejetés</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-10">Chargement...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Document
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Stagiaire
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500 dark:text-gray-400">
                      Aucun document trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {doc.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-agl-blue" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {doc.type}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {doc.fileSize}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {doc.student}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(doc.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(doc.status)}`}>
                          {getStatusText(doc.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" leftIcon={<Eye size={16} />}>
                            Voir
                          </Button>
                          <Button variant="ghost" size="sm" leftIcon={<Download size={16} />}>
                            Télécharger
                          </Button>
                          {doc.status === 'pending' && (
                            <>
                              <Button variant="ghost" size="sm" leftIcon={<CheckCircle size={16} />}>
                                Approuver
                              </Button>
                              <Button variant="ghost" size="sm" leftIcon={<XCircle size={16} />}>
                                Rejeter
                              </Button>
                            </>
                          )}
                        </div>
                        {doc.status === 'rejected' && doc.comment && (
                          <div className="text-xs text-error-600 mt-1">{doc.comment}</div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredDocs.length}</span> sur <span className="font-medium">{documents.length}</span> résultats
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Précédent
              </Button>
              <Button variant="outline" size="sm" disabled>
                Suivant
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HRDocuments;
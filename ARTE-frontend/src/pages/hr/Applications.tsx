import React, { useEffect, useState } from 'react';
import { Search, Filter, Download, Calendar, ChevronDown, Mail, FileText, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  field: string;
  school: string;
  date: string;
  status: string;
  documents: string[];
  interview: string | null;
}

const HRApplications: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedField, setSelectedField] = useState<string>('all');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api.get('/hr/applications')
      .then(res => setApplications(res.data))
      .catch(() => setError('Erreur lors du chargement des candidatures.'))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400';
      case 'interview':
        return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400';
      case 'approved':
        return 'bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400';
      case 'rejected':
        return 'bg-error-100 dark:bg-error-900/20 text-error-800 dark:text-error-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'interview':
        return 'Entretien';
      case 'approved':
        return 'Approuvé';
      case 'rejected':
        return 'Rejeté';
      default:
        return status;
    }
  };

  // Filtrage local (statut, filière, recherche)
  const filteredApplications = applications.filter(app => {
    const statusMatch = selectedStatus === 'all' || app.status === selectedStatus;
    const fieldMatch = selectedField === 'all' || app.field.toLowerCase().replace(/ /g, '_') === selectedField;
    const searchMatch =
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase()) ||
      app.id.toLowerCase().includes(search.toLowerCase());
    return statusMatch && fieldMatch && searchMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Candidatures
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" leftIcon={<Download size={18} />}>
            Exporter
          </Button>
          <Button variant="primary" leftIcon={<Filter size={18} />}>
            Filtres
          </Button>
        </div>
      </div>

      <Card variant="default">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Rechercher une candidature..."
              leftIcon={<Search size={18} />}
              fullWidth
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-agl-blue focus:ring-2 focus:ring-agl-blue/20 py-2.5 px-4"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="interview">Entretien</option>
              <option value="approved">Approuvé</option>
              <option value="rejected">Rejeté</option>
            </select>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="block w-full rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-agl-blue focus:ring-2 focus:ring-agl-blue/20 py-2.5 px-4"
            >
              <option value="all">Toutes les filières</option>
              <option value="informatique">Informatique</option>
              <option value="genie_civil">Génie Civil</option>
              <option value="electromecanique">Électromécanique</option>
              <option value="gestion">Gestion</option>
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
                    Candidat
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Filière
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    École
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
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-500 dark:text-gray-400">
                      Aucune candidature trouvée.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {application.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {application.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {application.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {application.field}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {application.school}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(application.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(application.status)}`}>
                          {getStatusText(application.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {application.status === 'approved' && (
                            <Button variant="ghost" size="sm" leftIcon={<FileText size={16} />}>
                              Générer lettre
                            </Button>
                          )}
                          {application.status === 'pending' && (
                            <Button variant="ghost" size="sm" leftIcon={<Calendar size={16} />}>
                              Planifier entretien
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" leftIcon={<Mail size={16} />}>
                            Contacter
                          </Button>
                          <Button variant="outline" size="sm" rightIcon={<ChevronDown size={16} />}>
                            Actions
                          </Button>
                        </div>
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
              Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filteredApplications.length}</span> sur <span className="font-medium">{applications.length}</span> résultats
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Précédent
              </Button>
              <Button variant="outline" size="sm">
                Suivant
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HRApplications;
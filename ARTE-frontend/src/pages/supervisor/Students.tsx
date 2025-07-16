import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, User, Mail, Clock, FileText } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  field: string;
  startDate: string;
  endDate: string;
  status: string;
  progress: number;
  attendance: number;
}

const fields = [
  { value: 'all', label: 'Toutes les filières' },
  { value: 'informatique', label: 'Informatique' },
  { value: 'genie_civil', label: 'Génie Civil' },
  { value: 'electromecanique', label: 'Électromécanique' },
  { value: 'gestion', label: 'Gestion' },
];

const SupervisorStudents: React.FC = () => {
  const [selectedField, setSelectedField] = useState<string>('all');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError('');
      try {
        // Adapte le endpoint selon ton backend
        const res = await api.get('/encadreur/stagiaires');
        setStudents(res.data);
      } catch (err: any) {
        setError("Erreur lors du chargement des stagiaires.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400';
      case 'completed':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400';
      case 'terminated':
        return 'bg-error-100 dark:bg-error-900/20 text-error-800 dark:text-error-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      case 'terminated':
        return 'Interrompu';
      default:
        return status;
    }
  };

  // Filtrage par filière et recherche
  const filteredStudents = students.filter((student) => {
    const fieldMatch = selectedField === 'all' || student.field.toLowerCase() === selectedField;
    const searchMatch =
      search === '' ||
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase());
    return fieldMatch && searchMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Mes stagiaires
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Rechercher un stagiaire..."
              leftIcon={<Search size={18} />}
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="block w-full rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-agl-blue focus:ring-2 focus:ring-agl-blue/20 py-2.5 px-4"
            >
              {fields.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">Chargement...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Stagiaire
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Filière
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Période
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Progression
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Assiduité
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
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      Aucun stagiaire trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {student.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {student.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {student.field}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(student.startDate).toLocaleDateString('fr-FR')} - {new Date(student.endDate).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-agl-blue rounded-full"
                              style={{ width: `${student.progress}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            {student.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                student.attendance >= 90
                                  ? 'bg-success-500'
                                  : student.attendance >= 75
                                  ? 'bg-warning-500'
                                  : 'bg-error-500'
                              }`}
                              style={{ width: `${student.attendance}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            {student.attendance}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(student.status)}`}>
                          {getStatusText(student.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" leftIcon={<User size={16} />}>
                            Profil
                          </Button>
                          <Button variant="ghost" size="sm" leftIcon={<Mail size={16} />}>
                            Message
                          </Button>
                          <Button variant="ghost" size="sm" leftIcon={<Clock size={16} />}>
                            Présence
                          </Button>
                          <Button variant="ghost" size="sm" leftIcon={<FileText size={16} />}>
                            Documents
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
              Affichage de <span className="font-medium">{filteredStudents.length > 0 ? 1 : 0}</span> à <span className="font-medium">{filteredStudents.length}</span> sur <span className="font-medium">{filteredStudents.length}</span> résultats
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

export default SupervisorStudents;
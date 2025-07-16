import React, { useEffect, useState } from 'react';
import { Search, Filter, Download, User, Mail, Users, Plus } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';

interface Supervisor {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  activeInterns: number;
  totalInterns: number;
  rating: number;
}

const AdminSupervisors: React.FC = () => {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api.get('/admin/supervisors')
      .then(res => setSupervisors(res.data))
      .catch(() => setError('Erreur lors du chargement des encadreurs.'))
      .finally(() => setLoading(false));
  }, []);

  // Extraction dynamique des départements pour le filtre
  const departments = Array.from(new Set(supervisors.map(s => s.department)));

  // Filtres locaux
  const filteredSupervisors = supervisors.filter(supervisor => {
    const matchesDepartment = selectedDepartment === 'all' || supervisor.department === selectedDepartment;
    const matchesSearch =
      search.trim() === '' ||
      supervisor.name.toLowerCase().includes(search.toLowerCase()) ||
      supervisor.email.toLowerCase().includes(search.toLowerCase()) ||
      supervisor.id.toLowerCase().includes(search.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Encadreurs
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" leftIcon={<Download size={18} />}>
            Exporter
          </Button>
          <Button variant="primary" leftIcon={<Plus size={18} />}>
            Nouvel encadreur
          </Button>
        </div>
      </div>

      <Card variant="default">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Rechercher un encadreur..."
              leftIcon={<Search size={18} />}
              value={search}
              onChange={e => setSearch(e.target.value)}
              fullWidth
            />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="block w-full rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-agl-blue focus:ring-2 focus:ring-agl-blue/20 py-2.5 px-4"
            >
              <option value="all">Tous les départements</option>
              {departments.map(dep => (
                <option key={dep} value={dep}>{dep}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">Chargement...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Encadreur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Département</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Poste</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stagiaires</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Évaluation</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSupervisors.map(supervisor => (
                    <tr key={supervisor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {supervisor.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {supervisor.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {supervisor.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {supervisor.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {supervisor.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {supervisor.activeInterns}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 mx-1">/</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {supervisor.totalInterns} total
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, index) => (
                                <svg
                                  key={index}
                                  className={`h-4 w-4 ${
                                    index < Math.floor(supervisor.rating)
                                      ? 'text-yellow-400'
                                      : 'text-gray-300 dark:text-gray-600'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            {supervisor.rating}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" leftIcon={<User size={16} />}>
                            Profil
                          </Button>
                          <Button variant="ghost" size="sm" leftIcon={<Mail size={16} />}>
                            Message
                          </Button>
                          <Button variant="ghost" size="sm" leftIcon={<Users size={16} />}>
                            Stagiaires
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredSupervisors.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center text-gray-500 dark:text-gray-400 py-8">
                        Aucun encadreur trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Affichage de <span className="font-medium">{filteredSupervisors.length > 0 ? 1 : 0}</span> à <span className="font-medium">{filteredSupervisors.length}</span> sur <span className="font-medium">{filteredSupervisors.length}</span> résultats
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
          </>
        )}
      </Card>
    </div>
  );
};

export default AdminSupervisors;
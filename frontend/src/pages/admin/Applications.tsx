import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, ChevronDown, Mail } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const AdminApplications: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedField, setSelectedField] = useState<string>('all');
  
  // Mock data
  const applications = [
    {
      id: 'APP-3421',
      name: 'Sophie Martin',
      email: 'sophie.martin@example.com',
      phone: '+237 612345688',
      field: 'Informatique',
      school: 'ENSPY',
      date: '2025-03-18',
      status: 'pending',
      documents: ['CV', 'Lettre de motivation', 'Certificat de scolarité']
    },
    {
      id: 'APP-3420',
      name: 'Paul Biya',
      email: 'paul.biya@example.com',
      phone: '+237 612345699',
      field: 'Électromécanique',
      school: 'IUT Douala',
      date: '2025-03-17',
      status: 'interview',
      documents: ['CV', 'Lettre de motivation', 'Certificat de scolarité']
    },
    {
      id: 'APP-3419',
      name: 'Marie Kamga',
      email: 'marie.kamga@example.com',
      phone: '+237 612345677',
      field: 'Gestion',
      school: 'ESSEC',
      date: '2025-03-16',
      status: 'approved',
      documents: ['CV', 'Lettre de motivation', 'Certificat de scolarité']
    },
    {
      id: 'APP-3418',
      name: 'Antoine Fouda',
      email: 'antoine.fouda@example.com',
      phone: '+237 612345666',
      field: 'Génie Civil',
      school: 'ENSET Kumba',
      date: '2025-03-15',
      status: 'rejected',
      documents: ['CV', 'Lettre de motivation', 'Certificat de scolarité']
    }
  ];

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
              {applications.map((application) => (
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
                      <Button variant="ghost" size="sm" leftIcon={<Calendar size={16} />}>
                        Entretien
                      </Button>
                      <Button variant="ghost" size="sm" leftIcon={<Mail size={16} />}>
                        Contacter
                      </Button>
                      <Button variant="outline" size="sm" rightIcon={<ChevronDown size={16} />}>
                        Actions
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Affichage de <span className="font-medium">1</span> à <span className="font-medium">10</span> sur <span className="font-medium">20</span> résultats
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

export default AdminApplications;
import React from 'react';
import { 
  Users, FileText, Calendar, Clock, 
  TrendingUp, ArrowUpRight, ArrowDownRight, ChevronRight
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const AdminDashboard: React.FC = () => {
  // Mock data
  const stats = {
    totalApplications: 124,
    applicationsThisMonth: 42,
    applicationsChange: 18,
    pendingApplications: 28,
    activeInterns: 56,
    activeInternsChange: 12,
    completedInternships: 40,
    departments: [
      { name: 'Informatique', count: 23 },
      { name: 'Génie Civil', count: 14 },
      { name: 'Ressources Humaines', count: 8 },
      { name: 'Logistique', count: 11 },
    ],
    recentApplications: [
      { id: 'APP-3421', name: 'Sophie Martin', field: 'Informatique', school: 'ENSPY', date: '2025-03-18', status: 'pending' },
      { id: 'APP-3420', name: 'Paul Biya', field: 'Électromécanique', school: 'IUT Douala', date: '2025-03-17', status: 'interview' },
      { id: 'APP-3419', name: 'Marie Kamga', field: 'Gestion', school: 'ESSEC', date: '2025-03-16', status: 'approved' },
      { id: 'APP-3418', name: 'Antoine Fouda', field: 'Génie Civil', school: 'ENSET Kumba', date: '2025-03-15', status: 'rejected' },
    ],
    upcomingInterviews: [
      { id: 'INT-129', candidate: 'Paul Biya', time: '2025-03-20 10:00', duration: '45 min', interviewer: 'Marc Ateba' },
      { id: 'INT-130', candidate: 'Jeanne Fouda', time: '2025-03-20 14:30', duration: '45 min', interviewer: 'Sylvie Ngono' },
      { id: 'INT-131', candidate: 'Emmanuel Tabi', time: '2025-03-21 09:15', duration: '45 min', interviewer: 'Marc Ateba' },
    ]
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="elevated" className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Candidatures totales</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{stats.totalApplications}</p>
              <div className="mt-2 flex items-center">
                <span className={`text-xs font-medium flex items-center ${
                  stats.applicationsChange > 0 
                    ? 'text-success-600 dark:text-success-400' 
                    : 'text-error-600 dark:text-error-400'
                }`}>
                  {stats.applicationsChange > 0 ? (
                    <ArrowUpRight size={16} className="mr-1" />
                  ) : (
                    <ArrowDownRight size={16} className="mr-1" />
                  )}
                  {Math.abs(stats.applicationsChange)}% ce mois
                </span>
              </div>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-3">
              <FileText size={24} className="text-agl-blue" />
            </div>
          </div>
        </Card>
        
        <Card variant="elevated" className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Candidatures en attente</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{stats.pendingApplications}</p>
              <div className="mt-2 flex items-center">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {Math.round((stats.pendingApplications / stats.totalApplications) * 100)}% du total
                </span>
              </div>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/20 rounded-full p-3">
              <Clock size={24} className="text-orange-600" />
            </div>
          </div>
        </Card>
        
        <Card variant="elevated" className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Stagiaires actifs</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{stats.activeInterns}</p>
              <div className="mt-2 flex items-center">
                <span className={`text-xs font-medium flex items-center ${
                  stats.activeInternsChange > 0 
                    ? 'text-success-600 dark:text-success-400' 
                    : 'text-error-600 dark:text-error-400'
                }`}>
                  {stats.activeInternsChange > 0 ? (
                    <ArrowUpRight size={16} className="mr-1" />
                  ) : (
                    <ArrowDownRight size={16} className="mr-1" />
                  )}
                  {Math.abs(stats.activeInternsChange)} depuis le mois dernier
                </span>
              </div>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-3">
              <Users size={24} className="text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card variant="elevated" className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Stages terminés</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{stats.completedInternships}</p>
              <div className="mt-2 flex items-center">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Cette année
                </span>
              </div>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/20 rounded-full p-3">
              <Calendar size={24} className="text-purple-600" />
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="default" className="lg:col-span-2">
          <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Candidatures récentes
            </h2>
            <Button variant="ghost" size="sm" rightIcon={<ChevronRight size={16} />}>
              Voir tout
            </Button>
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
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {stats.recentApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {application.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {application.name}
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
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        application.status === 'pending'
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
                          : application.status === 'interview'
                          ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400'
                          : application.status === 'approved'
                          ? 'bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400'
                          : 'bg-error-100 dark:bg-error-900/20 text-error-800 dark:text-error-400'
                      }`}>
                        {application.status === 'pending'
                          ? 'En attente'
                          : application.status === 'interview'
                          ? 'Entretien'
                          : application.status === 'approved'
                          ? 'Approuvé'
                          : 'Rejeté'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        
        <Card variant="default">
          <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Répartition par département
            </h2>
          </div>
          
          <div className="p-5">
            <div className="space-y-4">
              {stats.departments.map((dept) => (
                <div key={dept.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{dept.name}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{dept.count} stagiaires</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-agl-blue h-2.5 rounded-full" 
                      style={{ width: `${(dept.count / stats.activeInterns) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <Button variant="outline" size="sm" fullWidth>
                Voir toutes les statistiques
              </Button>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="default" className="lg:col-span-2">
          <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Entretiens à venir
            </h2>
            <Button variant="ghost" size="sm" rightIcon={<ChevronRight size={16} />}>
              Voir tout
            </Button>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {stats.upcomingInterviews.map((interview) => (
              <div key={interview.id} className="px-5 py-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{interview.candidate}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(interview.time).toLocaleString('fr-FR', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Durée: {interview.duration}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Interviewer: {interview.interviewer}</p>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <Button variant="outline" size="sm">
                    Reprogrammer
                  </Button>
                  <Button variant="primary" size="sm">
                    Détails
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <Card variant="default">
          <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Taux d'acceptation
            </h2>
          </div>
          
          <div className="p-5">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-900/20">
                <div className="text-3xl font-bold text-agl-blue">72%</div>
              </div>
            </div>
            
            <div className="space-y-4 mt-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Approuvées</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">72%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-success-500 h-2.5 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">En attente</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">16%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-warning-500 h-2.5 rounded-full" style={{ width: '16%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rejetées</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">12%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-error-500 h-2.5 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Mois en cours</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Mars 2025</p>
                </div>
                <div className="flex items-center text-agl-blue">
                  <TrendingUp size={16} className="mr-1" />
                  <span className="text-sm font-medium">+5.2%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
import React, { useEffect, useState } from 'react';
import {
  Users, FileText, Calendar, Clock,
  TrendingUp, ArrowUpRight, ArrowDownRight, ChevronRight
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../services/api';

interface DepartmentStats {
  name: string;
  count: number;
}
interface RecentApplication {
  id: string;
  name: string;
  field: string;
  school: string;
  date: string;
  status: string;
}
interface UpcomingInterview {
  id: string;
  candidate: string;
  time: string;
  duration: string;
  interviewer: string;
}
interface AdminDashboardData {
  totalApplications: number;
  applicationsThisMonth: number;
  applicationsChange: number;
  pendingApplications: number;
  activeInterns: number;
  activeInternsChange: number;
  completedInternships: number;
  departments: DepartmentStats[];
  recentApplications: RecentApplication[];
  upcomingInterviews: UpcomingInterview[];
}

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api.get('/admin/dashboard')
      .then(res => setData(res.data))
      .catch(() => setError('Erreur lors du chargement du tableau de bord.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-10">Chargement...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : data && (
        <>
          {/* Cartes de statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="elevated" className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Candidatures reçues</p>
                <p className="mt-2 text-3xl font-semibold">{data.totalApplications}</p>
              </div>
              <Users size={32} className="text-agl-blue" />
            </Card>
            <Card variant="elevated" className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Stagiaires actifs</p>
                <p className="mt-2 text-3xl font-semibold">{data.activeInterns}</p>
              </div>
              <FileText size={32} className="text-camrail-red" />
            </Card>
            <Card variant="elevated" className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Stages terminés</p>
                <p className="mt-2 text-3xl font-semibold">{data.completedInternships}</p>
              </div>
              <Calendar size={32} className="text-purple-600" />
            </Card>
          </div>

          {/* Répartition par département */}
          <Card variant="default">
            <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Répartition par département
              </h2>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.departments.map(dep => (
                <div key={dep.name} className="flex justify-between">
                  <span className="text-sm">{dep.name}</span>
                  <span className="font-semibold">{dep.count}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Applications récentes */}
          <Card variant="default">
            <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Dernières candidatures
              </h2>
              <Button variant="ghost" size="sm" rightIcon={<ChevronRight size={16} />}>
                Voir tout
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Candidat</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Filière</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">École</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {data.recentApplications.map(app => (
                    <tr key={app.id}>
                      <td className="px-6 py-4">{app.id}</td>
                      <td className="px-6 py-4">{app.name}</td>
                      <td className="px-6 py-4">{app.field}</td>
                      <td className="px-6 py-4">{app.school}</td>
                      <td className="px-6 py-4">{new Date(app.date).toLocaleDateString('fr-FR')}</td>
                      <td className="px-6 py-4">{app.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Entretiens à venir */}
          <Card variant="default">
            <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Entretiens à venir
              </h2>
            </div>
            <div className="p-5">
              {data.upcomingInterviews.length === 0 ? (
                <div className="text-gray-500 dark:text-gray-400">Aucun entretien à venir.</div>
              ) : (
                <ul className="space-y-2">
                  {data.upcomingInterviews.map(intv => (
                    <li key={intv.id} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{intv.candidate}</span> — {intv.time} ({intv.duration})
                      </div>
                      <span className="text-sm text-gray-500">Avec {intv.interviewer}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
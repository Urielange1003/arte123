import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Users, FileText, Calendar, Award } from 'lucide-react';
import Card from '../../components/ui/Card';
import api from '../../services/api';

interface DepartmentStats {
  name: string;
  count: number;
}
interface MonthlyStat {
  month: string;
  applications: number;
  acceptanceRate: number;
}
interface AdminStatisticsData {
  applications: {
    total: number;
    thisMonth: number;
    change: number;
    pending: number;
    approved: number;
    rejected: number;
    interview: number;
  };
  interns: {
    active: number;
    completed: number;
    change: number;
    departments: DepartmentStats[];
  };
  monthlyStats: MonthlyStat[];
}

const AdminStatistics: React.FC = () => {
  const [data, setData] = useState<AdminStatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api.get('/admin/statistics')
      .then(res => setData(res.data))
      .catch(() => setError('Erreur lors du chargement des statistiques.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Statistiques
      </h1>
      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-10">Chargement...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : data && (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card variant="elevated" className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Candidatures totales</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{data.applications.total}</p>
                <div className="mt-2 flex items-center">
                  <span className={`text-xs font-medium flex items-center ${
                    data.applications.change > 0 
                      ? 'text-success-600 dark:text-success-400' 
                      : 'text-error-600 dark:text-error-400'
                  }`}>
                    {data.applications.change > 0 ? (
                      <TrendingUp size={16} className="mr-1" />
                    ) : (
                      <TrendingDown size={16} className="mr-1" />
                    )}
                    {Math.abs(data.applications.change)}% ce mois
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
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Stagiaires actifs</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{data.interns.active}</p>
                <div className="mt-2 flex items-center">
                  <span className={`text-xs font-medium flex items-center ${
                    data.interns.change > 0 
                      ? 'text-success-600 dark:text-success-400' 
                      : 'text-error-600 dark:text-error-400'
                  }`}>
                    {data.interns.change > 0 ? (
                      <TrendingUp size={16} className="mr-1" />
                    ) : (
                      <TrendingDown size={16} className="mr-1" />
                    )}
                    {Math.abs(data.interns.change)} depuis le mois dernier
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
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{data.interns.completed}</p>
                <div className="mt-2 flex items-center">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Cette année
                  </span>
                </div>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/20 rounded-full p-3">
                <Award size={24} className="text-purple-600" />
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Taux d'acceptation</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                  {data.monthlyStats.length > 0 ? `${data.monthlyStats[data.monthlyStats.length-1].acceptanceRate}%` : '--'}
                </p>
                <div className="mt-2 flex items-center">
                  <span className="text-xs font-medium text-success-600 dark:text-success-400 flex items-center">
                    <TrendingUp size={16} className="mr-1" />
                    +5.2% ce mois
                  </span>
                </div>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/20 rounded-full p-3">
                <Calendar size={24} className="text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card variant="default">
            <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                État des candidatures
              </h2>
            </div>
            
            <div className="p-5">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Approuvées</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {Math.round((data.applications.approved / data.applications.total) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-success-500 h-2.5 rounded-full" 
                      style={{ width: `${(data.applications.approved / data.applications.total) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">En attente</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {Math.round((data.applications.pending / data.applications.total) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-warning-500 h-2.5 rounded-full" 
                      style={{ width: `${(data.applications.pending / data.applications.total) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Entretien</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {Math.round((data.applications.interview / data.applications.total) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-blue-500 h-2.5 rounded-full" 
                      style={{ width: `${(data.applications.interview / data.applications.total) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rejetées</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {Math.round((data.applications.rejected / data.applications.total) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-error-500 h-2.5 rounded-full" 
                      style={{ width: `${(data.applications.rejected / data.applications.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ce mois</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                      {data.applications.thisMonth}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">candidatures</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Moyenne mensuelle</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                      {Math.round(data.monthlyStats.reduce((sum, stat) => sum + stat.applications, 0) / data.monthlyStats.length)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">candidatures</p>
                  </div>
                </div>
              </div>
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
                {data.interns.departments.map((dept) => (
                  <div key={dept.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{dept.name}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{dept.count} stagiaires</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-agl-blue h-2.5 rounded-full" 
                        style={{ width: `${(dept.count / data.interns.active) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Capacité moyenne</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                      {Math.round(data.interns.active / data.interns.departments.length)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">par département</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Taux d'occupation</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                      {Math.round((data.interns.active / (data.interns.departments.length * 20)) * 100)}%
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">des places</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card variant="default">
          <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Évolution mensuelle
            </h2>
          </div>
          
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.monthlyStats.map((stat) => (
                <div key={stat.month} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{stat.month} 2025</p>
                    <span className="text-xs font-medium text-success-600 dark:text-success-400 flex items-center">
                      <TrendingUp size={14} className="mr-1" />
                      +{stat.acceptanceRate}%
                    </span>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stat.applications}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    candidatures
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Taux d'acceptation
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {stat.acceptanceRate}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
        </>
      )}
    </div>
  );
};

export default AdminStatistics;
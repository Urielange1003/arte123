import React from 'react';
import { TrendingUp, TrendingDown, Users, FileText, Calendar, Award } from 'lucide-react';
import Card from '../../components/ui/Card';

const AdminStatistics: React.FC = () => {
  // Mock data
  const stats = {
    applications: {
      total: 124,
      thisMonth: 42,
      change: 18,
      pending: 28,
      approved: 65,
      rejected: 16,
      interview: 15
    },
    interns: {
      active: 56,
      completed: 40,
      change: 12,
      departments: [
        { name: 'Informatique', count: 23 },
        { name: 'Génie Civil', count: 14 },
        { name: 'Ressources Humaines', count: 8 },
        { name: 'Logistique', count: 11 }
      ]
    },
    monthlyStats: [
      { month: 'Jan', applications: 35, acceptanceRate: 68 },
      { month: 'Fév', applications: 28, acceptanceRate: 71 },
      { month: 'Mar', applications: 42, acceptanceRate: 72 }
    ]
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Statistiques
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="elevated" className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Candidatures totales</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{stats.applications.total}</p>
              <div className="mt-2 flex items-center">
                <span className={`text-xs font-medium flex items-center ${
                  stats.applications.change > 0 
                    ? 'text-success-600 dark:text-success-400' 
                    : 'text-error-600 dark:text-error-400'
                }`}>
                  {stats.applications.change > 0 ? (
                    <TrendingUp size={16} className="mr-1" />
                  ) : (
                    <TrendingDown size={16} className="mr-1" />
                  )}
                  {Math.abs(stats.applications.change)}% ce mois
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
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{stats.interns.active}</p>
              <div className="mt-2 flex items-center">
                <span className={`text-xs font-medium flex items-center ${
                  stats.interns.change > 0 
                    ? 'text-success-600 dark:text-success-400' 
                    : 'text-error-600 dark:text-error-400'
                }`}>
                  {stats.interns.change > 0 ? (
                    <TrendingUp size={16} className="mr-1" />
                  ) : (
                    <TrendingDown size={16} className="mr-1" />
                  )}
                  {Math.abs(stats.interns.change)} depuis le mois dernier
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
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{stats.interns.completed}</p>
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
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">72%</p>
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
                    {Math.round((stats.applications.approved / stats.applications.total) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-success-500 h-2.5 rounded-full" 
                    style={{ width: `${(stats.applications.approved / stats.applications.total) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">En attente</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {Math.round((stats.applications.pending / stats.applications.total) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-warning-500 h-2.5 rounded-full" 
                    style={{ width: `${(stats.applications.pending / stats.applications.total) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Entretien</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {Math.round((stats.applications.interview / stats.applications.total) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full" 
                    style={{ width: `${(stats.applications.interview / stats.applications.total) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rejetées</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {Math.round((stats.applications.rejected / stats.applications.total) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-error-500 h-2.5 rounded-full" 
                    style={{ width: `${(stats.applications.rejected / stats.applications.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ce mois</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                    {stats.applications.thisMonth}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">candidatures</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Moyenne mensuelle</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">35</p>
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
              {stats.interns.departments.map((dept) => (
                <div key={dept.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{dept.name}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{dept.count} stagiaires</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-agl-blue h-2.5 rounded-full" 
                      style={{ width: `${(dept.count / stats.interns.active) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Capacité moyenne</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">15</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">par département</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Taux d'occupation</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">82%</p>
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
            {stats.monthlyStats.map((stat) => (
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
    </div>
  );
};

export default AdminStatistics;
import React from 'react';
import { 
  Users, Clock, CheckCircle, MessageSquare,
  FileText, AlertTriangle, ChevronRight
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const SupervisorDashboard: React.FC = () => {
  // Mock data
  const data = {
    totalInterns: 14,
    activeInterns: 12,
    absentInterns: 2,
    unreadMessages: 5,
    recentActivities: [
      { id: 1, type: 'presence', student: 'Sophie Martin', time: '09:15', date: '2025-03-18', status: 'present' },
      { id: 2, type: 'document', student: 'Paul Biya', document: 'Rapport hebdomadaire', date: '2025-03-17', status: 'submitted' },
      { id: 3, type: 'message', student: 'Antoine Fouda', message: 'Question sur le projet', date: '2025-03-17', status: 'unread' },
      { id: 4, type: 'presence', student: 'Marie Kamga', time: 'Absent', date: '2025-03-16', status: 'absent' },
    ],
    interns: [
      { id: 1, name: 'Sophie Martin', field: 'Informatique', attendance: 95, progress: 78, documentsSubmitted: 8, documentsTotal: 10 },
      { id: 2, name: 'Paul Biya', field: 'Électromécanique', attendance: 87, progress: 62, documentsSubmitted: 6, documentsTotal: 10 },
      { id: 3, name: 'Antoine Fouda', field: 'Génie Civil', attendance: 100, progress: 70, documentsSubmitted: 7, documentsTotal: 10 },
      { id: 4, name: 'Marie Kamga', field: 'Gestion', attendance: 85, progress: 55, documentsSubmitted: 5, documentsTotal: 10 },
    ],
    upcomingTasks: [
      { id: 1, task: 'Évaluation de mi-stage', student: 'Sophie Martin', dueDate: '2025-03-25', priority: 'high' },
      { id: 2, task: 'Révision du rapport', student: 'Paul Biya', dueDate: '2025-03-22', priority: 'medium' },
      { id: 3, task: 'Réunion hebdomadaire', student: 'Tous les stagiaires', dueDate: '2025-03-20', priority: 'medium' },
    ]
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="elevated" className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Stagiaires</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{data.totalInterns}</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {data.activeInterns} actifs, {data.totalInterns - data.activeInterns} terminés
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-3">
              <Users size={24} className="text-agl-blue" />
            </div>
          </div>
        </Card>
        
        <Card variant="elevated" className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Présence aujourd'hui</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{data.activeInterns - data.absentInterns}/{data.activeInterns}</p>
              <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                {Math.round(((data.activeInterns - data.absentInterns) / data.activeInterns) * 100)}% de présence
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-3">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card variant="elevated" className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Absences</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{data.absentInterns}</p>
              <p className="mt-2 text-sm text-orange-600 dark:text-orange-400">
                {Math.round((data.absentInterns / data.activeInterns) * 100)}% des stagiaires
              </p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/20 rounded-full p-3">
              <AlertTriangle size={24} className="text-orange-600" />
            </div>
          </div>
        </Card>
        
        <Card variant="elevated" className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Messages non lus</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{data.unreadMessages}</p>
              <p className="mt-2 text-sm text-purple-600 dark:text-purple-400">
                Dernière réception il y a 2h
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/20 rounded-full p-3">
              <MessageSquare size={24} className="text-purple-600" />
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="default" className="lg:col-span-2">
          <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Activités récentes
            </h2>
            <Button variant="ghost" size="sm" rightIcon={<ChevronRight size={16} />}>
              Voir tout
            </Button>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.recentActivities.map((activity) => (
              <div key={activity.id} className="px-5 py-4 flex items-start justify-between">
                <div className="flex items-start">
                  <div className="mr-3">
                    {activity.type === 'presence' ? (
                      activity.status === 'present' ? (
                        <Clock size={20} className="text-green-500" />
                      ) : (
                        <Clock size={20} className="text-error-500" />
                      )
                    ) : activity.type === 'document' ? (
                      <FileText size={20} className="text-agl-blue" />
                    ) : (
                      <MessageSquare size={20} className="text-purple-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{activity.student}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.type === 'presence' ? (
                        activity.status === 'present' ? (
                          `Présent(e) à ${activity.time}`
                        ) : (
                          'Absent(e)'
                        )
                      ) : activity.type === 'document' ? (
                        `A soumis "${activity.document}"`
                      ) : (
                        `Message: "${activity.message}"`
                      )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(activity.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                {activity.type === 'document' && (
                  <Button variant="ghost" size="sm">
                    Voir
                  </Button>
                )}
                {activity.type === 'message' && (
                  <Button variant="primary" size="sm">
                    Répondre
                  </Button>
                )}
                {activity.type === 'presence' && activity.status === 'absent' && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-error-100 dark:bg-error-900/20 text-error-800 dark:text-error-400">
                    Non justifiée
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>
        
        <Card variant="default">
          <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Tâches à venir
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.upcomingTasks.map((task) => (
              <div key={task.id} className="px-5 py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{task.task}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {task.student}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    task.priority === 'high' 
                      ? 'bg-error-100 dark:bg-error-900/20 text-error-800 dark:text-error-400' 
                      : task.priority === 'medium'
                      ? 'bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-400'
                      : 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
                  }`}>
                    {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="mt-3">
                  <Button variant="outline" size="sm">
                    Marquer comme terminé
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-5 border-t border-gray-200 dark:border-gray-700">
            <Button variant="primary" fullWidth>
              Ajouter une tâche
            </Button>
          </div>
        </Card>
      </div>
      
      <Card variant="default">
        <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Progression des stagiaires
          </h2>
          <Button variant="ghost" size="sm" rightIcon={<ChevronRight size={16} />}>
            Voir tous les stagiaires
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stagiaire
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Filière
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Assiduité
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Progression
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Documents
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {data.interns.map((intern) => (
                <tr key={intern.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {intern.name.charAt(0)}{intern.name.split(' ')[1]?.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {intern.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{intern.field}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div 
                        className={`absolute top-0 left-0 h-full rounded-full ${
                          intern.attendance >= 90 
                            ? 'bg-success-500' 
                            : intern.attendance >= 75 
                            ? 'bg-warning-500' 
                            : 'bg-error-500'
                        }`}
                        style={{ width: `${intern.attendance}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 text-xs text-right text-gray-500 dark:text-gray-400">
                      {intern.attendance}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div 
                        className="absolute top-0 left-0 h-full bg-agl-blue rounded-full"
                        style={{ width: `${intern.progress}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 text-xs text-right text-gray-500 dark:text-gray-400">
                      {intern.progress}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {intern.documentsSubmitted}/{intern.documentsTotal}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="outline" size="sm">
                      Voir profil
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SupervisorDashboard;
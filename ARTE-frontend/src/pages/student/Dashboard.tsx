import React, { useEffect, useState } from 'react';
import { 
  Clock, FileText, CheckCircle, AlertTriangle,
  Calendar, MessageSquare, User, Award
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../services/api';

interface StudentInfo {
  name: string;
  field: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  supervisor: string;
  department: string;
  daysAttended: number;
  totalDays: number;
  notifications: number;
}

interface Task {
  id: number;
  title: string;
  dueDate: string;
  status: 'done' | 'pending' | 'planned';
  label: string; // e.g. "Terminé", "À venir", "Planifié"
  icon: React.ReactNode;
  colorClass: string;
}

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
}

interface Message {
  id: number;
  sender: string;
  date: string;
  content: string;
  isNew: boolean;
  senderInitials: string;
  senderColorClass: string;
}

const StudentDashboard: React.FC = () => {
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Helper to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      api.get('/stagiaire/dashboard'),
      api.get('/stagiaire/tasks'),
      api.get('/stagiaire/documents'),
      api.get('/stagiaire/messages/recent')
    ])
      .then(([studentRes, tasksRes, docsRes, messagesRes]) => {
        setStudent(studentRes.data);
        setTasks(tasksRes.data);
        setDocuments(docsRes.data);
        setMessages(messagesRes.data);
      })
      .catch(() => setError('Erreur lors du chargement du tableau de bord.'))
      .finally(() => setLoading(false));
  }, []);

  // Calcul des jours restants
  const daysRemaining = student ? student.totalDays - student.daysAttended : 0;

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-10">Chargement...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : student && (
        <>
          <div className="bg-gradient-to-r from-agl-blue to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold">Bienvenue, {student.name}</h1>
                <p className="mt-2 text-blue-100">
                  Votre stage en {student.field} est en cours. Vous êtes à {student.progress}% de votre parcours.
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col items-center">
                <div className="relative h-20 w-20">
                  <svg className="h-20 w-20 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#3B82F680"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="white"
                      strokeWidth="10"
                      strokeDasharray={`${student.progress * 2.83} ${283 - student.progress * 2.83}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
                    <span className="text-xl font-bold">{student.progress}%</span>
                  </div>
                </div>
                <span className="mt-2 text-sm text-blue-100">Progression</span>
              </div>
            </div>
          </div>

          {/* Infos principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card variant="elevated" className="flex items-center p-4">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3 mr-4">
                <Calendar size={24} className="text-agl-blue" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Période de stage</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(student.startDate)} au {formatDate(student.endDate)}
                </p>
              </div>
            </Card>
            <Card variant="elevated" className="flex items-center p-4">
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 mr-4">
                <User size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Encadreur</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {student.supervisor}
                </p>
              </div>
            </Card>
            <Card variant="elevated" className="flex items-center p-4">
              <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-3 mr-4">
                <Clock size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Jours effectués</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {student.daysAttended} / {student.totalDays} jours
                </p>
              </div>
            </Card>
            <Card variant="elevated" className="flex items-center p-4">
              <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-3 mr-4">
                <Award size={24} className="text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Département</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[180px]">
                  {student.department}
                </p>
              </div>
            </Card>
          </div>

          {/* Tâches et échéances */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card variant="default" className="lg:col-span-2">
              <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Tâches et échéances
                </h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {tasks.map((task) => (
                  <div key={task.id} className="px-5 py-4 flex items-start justify-between">
                    <div className="flex items-start">
                      <div className="mr-3">
                        {/* Choix d’icône/couleur selon le statut */}
                        {task.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Échéance: {formatDate(task.dueDate)}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${task.colorClass}`}>
                      {task.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" size="sm">
                  Voir toutes les tâches
                </Button>
              </div>
            </Card>

            {/* Documents récents */}
            <Card variant="default">
              <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Documents récents
                </h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {documents.map((doc) => (
                  <div key={doc.id} className="px-5 py-4 flex items-center">
                    <div className="mr-3">
                      <FileText size={20} className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{doc.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{doc.type}, {doc.size}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Voir
                    </Button>
                  </div>
                ))}
              </div>
              <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" size="sm">
                  Tous les documents
                </Button>
              </div>
            </Card>
          </div>

          {/* Messages récents et suivi de présence */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card variant="default" className="lg:col-span-2">
              <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Messages récents
                </h2>
                <div className="relative">
                  <span className="absolute -top-1 -right-1 bg-camrail-red text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {student.notifications}
                  </span>
                  <MessageSquare size={20} className="text-gray-500 dark:text-gray-400" />
                </div>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {messages.map((msg) => (
                  <div key={msg.id} className="px-5 py-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <div className={`h-10 w-10 rounded-full ${msg.senderColorClass} flex items-center justify-center mr-3`}>
                          <span className="font-medium">{msg.senderInitials}</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{msg.sender}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{msg.date}</p>
                        </div>
                      </div>
                      {msg.isNew && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-agl-blue/10 text-agl-blue">
                          Nouveau
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      {msg.content}
                    </p>
                    <div className="mt-3">
                      <Button variant="outline" size="sm">
                        Répondre
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" size="sm">
                  Voir tous les messages
                </Button>
              </div>
            </Card>

            {/* Suivi de présence */}
            <Card variant="default">
              <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Suivi de présence
                </h2>
              </div>
              <div className="p-5">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-agl-blue bg-blue-100 dark:bg-blue-900/20">
                        Jours effectués
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-agl-blue">
                        {student.daysAttended}/{student.totalDays}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-blue-900/20">
                    <div style={{ width: `${(student.daysAttended / student.totalDays) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-agl-blue"></div>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Jours restants</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{daysRemaining} jours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Heures de présence</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">384 heures</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Assiduité</span>
                    <span className="text-sm font-medium text-success-600">Excellente</span>
                  </div>
                </div>
                <div className="mt-6">
                  <Button variant="primary" size="sm" fullWidth>
                    Voir le détail de présence
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
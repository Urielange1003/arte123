import React from 'react';
import { 
  Clock, FileText, CheckCircle, AlertTriangle,
  Calendar, MessageSquare, User, Award
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const StudentDashboard: React.FC = () => {
  // Mock data
  const student = {
    name: 'Jean Dupont',
    field: 'Informatique',
    status: 'En cours',
    progress: 65,
    startDate: '2025-01-15',
    endDate: '2025-04-15',
    supervisor: 'Marie Curie',
    department: 'Direction des Systèmes d\'Information',
    daysAttended: 48,
    totalDays: 73,
    notifications: 3,
  };
  
  // Helper to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  // Calculate days remaining
  const daysRemaining = student.totalDays - student.daysAttended;
  
  return (
    <div className="space-y-6">
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="default" className="lg:col-span-2">
          <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Tâches et échéances
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="px-5 py-4 flex items-start justify-between">
              <div className="flex items-start">
                <div className="mr-3">
                  <CheckCircle size={20} className="text-success-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Rapport de mi-stage</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Échéance: 15 février 2025</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400">
                Terminé
              </span>
            </div>
            
            <div className="px-5 py-4 flex items-start justify-between">
              <div className="flex items-start">
                <div className="mr-3">
                  <AlertTriangle size={20} className="text-warning-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Rapport final</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Échéance: 10 avril 2025</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-400">
                À venir
              </span>
            </div>
            
            <div className="px-5 py-4 flex items-start justify-between">
              <div className="flex items-start">
                <div className="mr-3">
                  <Clock size={20} className="text-agl-blue" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Présentation finale</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Échéance: 14 avril 2025</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
                Planifié
              </span>
            </div>
          </div>
          
          <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" size="sm">
              Voir toutes les tâches
            </Button>
          </div>
        </Card>
        
        <Card variant="default">
          <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Documents récents
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="px-5 py-4 flex items-center">
              <div className="mr-3">
                <FileText size={20} className="text-gray-500 dark:text-gray-400" />
              </div>
              <div className="flex-grow">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Lettre de stage</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">PDF, 2.3 MB</p>
              </div>
              <Button variant="ghost" size="sm">
                Voir
              </Button>
            </div>
            
            <div className="px-5 py-4 flex items-center">
              <div className="mr-3">
                <FileText size={20} className="text-gray-500 dark:text-gray-400" />
              </div>
              <div className="flex-grow">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Fiche de présence - Mars</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">PDF, 1.8 MB</p>
              </div>
              <Button variant="ghost" size="sm">
                Voir
              </Button>
            </div>
            
            <div className="px-5 py-4 flex items-center">
              <div className="mr-3">
                <FileText size={20} className="text-gray-500 dark:text-gray-400" />
              </div>
              <div className="flex-grow">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Rapport de mi-stage</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">PDF, 3.7 MB</p>
              </div>
              <Button variant="ghost" size="sm">
                Voir
              </Button>
            </div>
          </div>
          
          <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" size="sm">
              Tous les documents
            </Button>
          </div>
        </Card>
      </div>
      
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
            <div className="px-5 py-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-agl-blue/10 flex items-center justify-center mr-3">
                    <span className="text-agl-blue font-medium">MC</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Marie Curie</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Aujourd'hui, 10:42</p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-agl-blue/10 text-agl-blue">
                  Nouveau
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Bonjour Jean, pourriez-vous m'envoyer le rapport de progression que vous avez commencé la semaine dernière ?
              </p>
              <div className="mt-3">
                <Button variant="outline" size="sm">
                  Répondre
                </Button>
              </div>
            </div>
            
            <div className="px-5 py-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-medium">RH</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Service RH</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Hier, 15:30</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Votre attestation de stage sera disponible à partir du 16 avril. N'oubliez pas de soumettre votre rapport final avant cette date.
              </p>
              <div className="mt-3">
                <Button variant="outline" size="sm">
                  Répondre
                </Button>
              </div>
            </div>
          </div>
          
          <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" size="sm">
              Voir tous les messages
            </Button>
          </div>
        </Card>
        
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
    </div>
  );
};

export default StudentDashboard;
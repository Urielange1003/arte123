import React from 'react';
import { User, Mail, Phone, School, BookOpen, Calendar, MapPin } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const StudentProfile: React.FC = () => {
  // Mock student data
  const student = {
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    phone: '+237 612345678',
    field: 'Informatique',
    school: 'Université de Yaoundé I',
    department: 'Direction des Systèmes d\'Information',
    supervisor: 'Marie Curie',
    startDate: '2025-01-15',
    endDate: '2025-04-15',
    address: 'Yaoundé, Cameroun',
  };

  return (
    <div className="space-y-6">
      <Card variant="elevated" className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">
              {student.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          
          <div className="flex-grow">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {student.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Stagiaire en {student.field}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" leftIcon={<Mail size={16} />}>
                Envoyer un email
              </Button>
              <Button variant="outline" size="sm" leftIcon={<Phone size={16} />}>
                Appeler
              </Button>
              <Button variant="outline" size="sm">
                Modifier le profil
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="default">
          <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Informations personnelles
            </h2>
          </div>
          
          <div className="p-5 space-y-4">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {student.email}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Téléphone</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {student.phone}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Adresse</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {student.address}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card variant="default">
          <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Informations académiques
            </h2>
          </div>
          
          <div className="p-5 space-y-4">
            <div className="flex items-center">
              <School className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">École</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {student.school}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Filière</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {student.field}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card variant="default">
          <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Informations de stage
            </h2>
          </div>
          
          <div className="p-5 space-y-4">
            <div className="flex items-center">
              <User className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Encadreur</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {student.supervisor}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Département</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {student.department}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Période</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Du {new Date(student.startDate).toLocaleDateString('fr-FR')} au {new Date(student.endDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card variant="default">
          <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Documents d'identité
            </h2>
          </div>
          
          <div className="p-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-agl-blue" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Carte d'identité
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PDF, 2.3 MB
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Voir
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-agl-blue" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Carte d'étudiant
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PDF, 1.8 MB
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Voir
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <Button variant="outline" size="sm" fullWidth>
                Mettre à jour les documents
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentProfile;
import React, { useEffect, useState } from 'react';
import { 
  FileText, Award, ChevronRight, 
  Mail, Calendar, CheckCircle, 
  AlertTriangle, Clock
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../services/api';

interface UpcomingEndDate {
  name: string;
  department: string;
  endDate: string;
}

interface RecentDocument {
  id: string;
  type: string;
  student: string;
  date: string;
  status: string;
}

interface HRDashboardData {
  pendingLetters: number;
  pendingCertificates: number;
  documentsToReview: number;
  upcomingEndDates: UpcomingEndDate[];
  recentDocuments: RecentDocument[];
  // Pour la section "Statistiques des documents" et "Tâches à effectuer", ajoute ici les champs si tu veux les rendre dynamiques plus tard
}

const HRDashboard: React.FC = () => {
  const [data, setData] = useState<HRDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api.get('/hr/dashboard')
      .then(res => setData(res.data))
      .catch(() => setError('Erreur lors du chargement du tableau de bord.'))
      .finally(() => setLoading(false));
  }, []);

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400';
      case 'approved':
        return 'bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-400';
      case 'signed':
        return 'bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-400';
      case 'sent':
        return 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400';
    }
  };

  // Get status display text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'approved':
        return 'À signer';
      case 'signed':
        return 'Signé';
      case 'sent':
        return 'Envoyé';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-10">Chargement...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="elevated" className="p-6 bg-gradient-to-br from-agl-blue to-blue-600 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-blue-100">Lettres de stage à générer</p>
                  <p className="mt-2 text-3xl font-semibold">{data.pendingLetters}</p>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <FileText size={24} className="text-white" />
                </div>
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  rightIcon={<ChevronRight size={16} />}
                >
                  Voir tout
                </Button>
              </div>
            </Card>
            
            <Card variant="elevated" className="p-6 bg-gradient-to-br from-camrail-red to-red-600 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-red-100">Attestations à générer</p>
                  <p className="mt-2 text-3xl font-semibold">{data.pendingCertificates}</p>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <Award size={24} className="text-white" />
                </div>
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  rightIcon={<ChevronRight size={16} />}
                >
                  Voir tout
                </Button>
              </div>
            </Card>
            
            <Card variant="elevated" className="p-6 bg-gradient-to-br from-purple-600 to-purple-800 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-purple-100">Documents à vérifier</p>
                  <p className="mt-2 text-3xl font-semibold">{data.documentsToReview}</p>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <CheckCircle size={24} className="text-white" />
                </div>
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  rightIcon={<ChevronRight size={16} />}
                >
                  Voir tout
                </Button>
              </div>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card variant="default" className="lg:col-span-2">
              <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Documents récents
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
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Stagiaire
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
                    {data.recentDocuments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-gray-500 dark:text-gray-400">
                          Aucun document récent.
                        </td>
                      </tr>
                    ) : (
                      data.recentDocuments.map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {doc.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {doc.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {doc.student}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(doc.date).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(doc.status)}`}>
                              {getStatusText(doc.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <Button
                              variant="ghost"
                              size="sm"
                            >
                              Voir
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
            
            <Card variant="default">
              <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Fins de stage à venir
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.upcomingEndDates.length === 0 ? (
                  <div className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                    Aucun stage en fin prochainement.
                  </div>
                ) : (
                  data.upcomingEndDates.map((intern, index) => (
                    <div key={index} className="px-5 py-4 flex justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{intern.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{intern.department}</p>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-warning-100 dark:bg-warning-900/20 rounded-full p-1 mr-2">
                          <Clock size={16} className="text-warning-600" />
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {new Date(intern.endDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="p-5 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="primary"
                  fullWidth
                  leftIcon={<Award size={16} />}
                >
                  Préparer les attestations
                </Button>
              </div>
            </Card>
          </div>
          
          {/* Les deux sections suivantes restent en mock ou à brancher dynamiquement si besoin */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card variant="default">
              <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Tâches à effectuer
                </h2>
                <Button variant="ghost" size="sm" rightIcon={<ChevronRight size={16} />}>
                  Voir tout
                </Button>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                <div className="px-5 py-4 flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="mr-3">
                      <AlertTriangle size={20} className="text-warning-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Signatures en attente</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">5 documents nécessitent votre signature</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Traiter
                  </Button>
                </div>
                
                <div className="px-5 py-4 flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="mr-3">
                      <Mail size={20} className="text-agl-blue" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Lettres à envoyer</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">3 lettres de stage à envoyer par email</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Traiter
                  </Button>
                </div>
                
                <div className="px-5 py-4 flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="mr-3">
                      <Calendar size={20} className="text-camrail-red" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Entretiens à programmer</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">7 candidats en attente d'entretien</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Traiter
                  </Button>
                </div>
              </div>
            </Card>
            
            <Card variant="default">
              <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Statistiques des documents
                </h2>
              </div>
              
              <div className="p-5">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-agl-blue mb-1">86%</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Lettres générées automatiquement</p>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">92%</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Attestations conformes</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Documents traités</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-agl-blue h-2.5 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Documents en attente</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">15%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-warning-500 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Documents rejetés</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">7%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-error-500 h-2.5 rounded-full" style={{ width: '7%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default HRDashboard;
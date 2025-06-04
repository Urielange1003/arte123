import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, Award, Users } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-agl-blue to-blue-700 min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 md:py-32">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Commencez votre carrière avec un stage chez Camrail
            </h1>
            <p className="mt-6 text-xl text-white/90 max-w-3xl">
              ARTE vous accompagne tout au long de votre parcours, de la candidature jusqu'à l'obtention de votre attestation de fin de stage.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row sm:justify-center md:justify-start gap-4">
              <Link to="/postuler">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="transition-all duration-300 transform hover:scale-105"
                >
                  Postuler maintenant
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                >
                  Espace stagiaire
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Gérez votre stage de A à Z
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Notre plateforme offre une expérience complète pour les stagiaires et facilite la gestion pour les encadreurs et le personnel administratif.
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card 
              variant="elevated" 
              className="transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex flex-col items-center text-center p-4">
                <div className="rounded-full bg-agl-blue/10 p-3 mb-4">
                  <FileText size={24} className="text-agl-blue" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Candidature simplifiée</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Postulez en ligne avec un formulaire intuitif et suivez l'avancement de votre candidature.
                </p>
              </div>
            </Card>
            
            <Card 
              variant="elevated" 
              className="transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex flex-col items-center text-center p-4">
                <div className="rounded-full bg-camrail-red/10 p-3 mb-4">
                  <Clock size={24} className="text-camrail-red" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Suivi de présence</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Enregistrez vos heures de présence et consultez votre historique en temps réel.
                </p>
              </div>
            </Card>
            
            <Card 
              variant="elevated" 
              className="transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex flex-col items-center text-center p-4">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <Award size={24} className="text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Documents officiels</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Générez automatiquement vos lettres d'acceptation et attestations de fin de stage.
                </p>
              </div>
            </Card>
            
            <Card 
              variant="elevated" 
              className="transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex flex-col items-center text-center p-4">
                <div className="rounded-full bg-purple-100 p-3 mb-4">
                  <Users size={24} className="text-purple-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Encadrement personnalisé</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Communiquez facilement avec votre encadreur et bénéficiez d'un suivi régulier.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-agl-blue">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Prêt à commencer ?</span>
            <span className="block text-camrail-red">Postulez dès aujourd'hui.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to="/postuler">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="transition-all duration-300 transform hover:scale-105"
                >
                  Postuler maintenant
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
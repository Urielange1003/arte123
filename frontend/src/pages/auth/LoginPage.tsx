import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Lock } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Demo login logic based on role
      switch (role) {
        case 'student':
          navigate('/etudiant');
          break;
        case 'admin':
          navigate('/admin');
          break;
        case 'hr':
          navigate('/rh');
          break;
        case 'supervisor':
          navigate('/encadreur');
          break;
        default:
          setError('Rôle non reconnu');
      }
    }, 1500);
  };
  
  return (
    <div className="w-full max-w-md">
      <Card variant="elevated" padding="lg" className="w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Connexion à ARTE</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Accédez à votre espace personnel
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-error-50 dark:bg-error-900/20 text-error-600 dark:text-error-400 rounded-xl">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              type="email"
              id="email"
              name="email"
              label="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@exemple.com"
              required
              fullWidth
              leftIcon={<User size={18} />}
            />
            
            <Input
              type="password"
              id="password"
              name="password"
              label="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
              fullWidth
              leftIcon={<Lock size={18} />}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Vous êtes
              </label>
              <div className="mt-1 grid grid-cols-2 gap-3">
                <div 
                  className={`rounded-2xl border p-3 cursor-pointer transition-all ${
                    role === 'student' 
                      ? 'border-agl-blue bg-blue-50 dark:bg-blue-900/20 text-agl-blue' 
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setRole('student')}
                >
                  <div className="flex items-center justify-center text-center">
                    <span className="font-medium">Stagiaire</span>
                  </div>
                </div>
                
                <div 
                  className={`rounded-2xl border p-3 cursor-pointer transition-all ${
                    role === 'supervisor' 
                      ? 'border-agl-blue bg-blue-50 dark:bg-blue-900/20 text-agl-blue' 
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setRole('supervisor')}
                >
                  <div className="flex items-center justify-center text-center">
                    <span className="font-medium">Encadreur</span>
                  </div>
                </div>
                
                <div 
                  className={`rounded-2xl border p-3 cursor-pointer transition-all ${
                    role === 'hr' 
                      ? 'border-agl-blue bg-blue-50 dark:bg-blue-900/20 text-agl-blue' 
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setRole('hr')}
                >
                  <div className="flex items-center justify-center text-center">
                    <span className="font-medium">RH</span>
                  </div>
                </div>
                
                <div 
                  className={`rounded-2xl border p-3 cursor-pointer transition-all ${
                    role === 'admin' 
                      ? 'border-agl-blue bg-blue-50 dark:bg-blue-900/20 text-agl-blue' 
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setRole('admin')}
                >
                  <div className="flex items-center justify-center text-center">
                    <span className="font-medium">Admin</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              leftIcon={<LogIn size={18} />}
            >
              Se connecter
            </Button>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pas encore inscrit ? <span className="text-agl-blue cursor-pointer">Contacter l'administration</span>
            </p>
          </div>
        </form>
      </Card>
      
      {/* Demo login info - would not be included in production */}
      <div className="mt-8 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-semibold">
          Pour démonstration seulement
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Sélectionnez un rôle et cliquez sur "Se connecter" avec n'importe quelles informations d'identification pour accéder à l'interface correspondante.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
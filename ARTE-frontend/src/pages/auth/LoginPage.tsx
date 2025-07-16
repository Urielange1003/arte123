
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, User, Lock, RefreshCw, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext'; // Assurez-vous que AuthContext.tsx est bien typé

// Définition de l'interface pour les informations utilisateur attendues de l'API
interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  // Ajoutez d'autres propriétés utilisateur si votre API les renvoie
}

// Définition de l'interface pour la réponse de connexion réussie de l'API
interface LoginResponseData {
  success: boolean;
  message: string;
  data: { // Selon votre console, la réponse est encapsulée dans 'data'
    access_token: string;
    user: UserData;
  };
}

// Définition de l'interface pour la réponse d'erreur de l'API
interface ErrorResponseData {
  success: boolean;
  message: string;
  errors?: { [key: string]: string[] }; // Pour les erreurs de validation 422
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'; // Fallback pour le développement

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedRoleUI, setSelectedRoleUI] = useState<string>('stagiaire'); // Type explicite

  const [isLoading, setIsLoading] = useState<boolean>(false); // Type explicite
  const [error, setError] = useState<string>(''); // Type explicite

  const navigate = useNavigate();
  const { login } = useAuth(); // useAuth doit fournir une fonction login correctement typée

  // Typage des paramètres de la fonction
  const storeAuthData = (token: string, userRole: string, userId: number, userName: string): void => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('userId', String(userId));
    localStorage.setItem('userName', userName);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => { // Typage du paramètre et du retour
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Utilisez une seule source de vérité pour l'URL de l'API.
      // Si API_BASE_URL contient déjà le port 8000, ne le mettez pas en dur dans fetch.
      // J'ai mis 'http://localhost:8000/api/login' en dur dans votre code. Utilisons API_BASE_URL.
      const apiUrl = `${API_BASE_URL}/api/login`; 

      // Correction importante: Utilisez la variable apiUrl ici, pas l'URL en dur
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest', // Important pour Laravel
        },
        body: JSON.stringify({ email, password, role: selectedRoleUI }),
        credentials: 'include', // Essentiel pour les cookies CSRF et de session
      });

      let data: LoginResponseData | ErrorResponseData; // La réponse peut être un succès ou une erreur
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('Erreur de parsing JSON de la réponse :', jsonError);
          const rawText = await response.text();
          setError(`Erreur serveur (${response.status || 'inconnu'}) : Réponse non JSON. Détails: ${rawText.substring(0, Math.min(rawText.length, 100))}...`);
          setIsLoading(false);
          return;
        }
      } else {
        const rawText = await response.text();
        console.error(`Réponse non JSON de l'API (${response.status || 'inconnu'}) :`, rawText);
        setError(`Erreur serveur (${response.status || 'inconnu'}) : ${rawText.substring(0, Math.min(rawText.length, 100))}...`);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        // La réponse n'est pas OK (statut 4xx ou 5xx)
        // Castez `data` vers ErrorResponseData pour un accès typé aux propriétés
        const errorData = data as ErrorResponseData;
        let errorMessage = 'Email ou mot de passe incorrect.';

        if (response.status === 404) {
          errorMessage = errorData.message || `La route de connexion (${apiUrl}) n'a pas été trouvée. Vérifiez l'URL de l'API dans votre frontend et les routes de votre backend.`;
        } else if (response.status === 422) {
          if (errorData.errors) {
            // Flatten les messages d'erreur de validation
            const validationMessages = Object.values(errorData.errors).flat().join(' ');
            errorMessage = `Erreurs de validation: ${validationMessages}`;
          } else {
            errorMessage = errorData.message || 'Données de formulaire invalides.';
          }
        } else if (response.status === 401) {
          errorMessage = errorData.message || 'Authentification échouée. Vérifiez vos identifiants.';
          localStorage.clear(); // Nettoie le local storage en cas d'échec d'authentification
        } else {
          errorMessage = errorData.message || `Une erreur inattendue est survenue (Statut: ${response.status}).`;
        }

        setError(errorMessage);
        console.error(`Erreur de connexion (Statut: ${response.status}) :`, errorData);
        return; // Important : arrête l'exécution si la réponse n'est pas OK
      }

      // Connexion réussie (la réponse est ok)
      // Castez `data` vers LoginResponseData pour un accès typé
      const successData = data as LoginResponseData;
      console.log('Connexion réussie :', successData.data);

      // --- GESTION DE L'ERREUR 'Cannot read properties of undefined (reading 'role')' ---
      // Vérifiez si data.data et data.data.user existent
      if (successData.data && successData.data.access_token && successData.data.user) {
        const { access_token, user } = successData.data;

        // Vérifiez si l'objet user contient la propriété 'role'
        if (!user.role) {
          setError('La réponse du serveur ne contient pas de rôle utilisateur. Contactez l\'administrateur.');
          localStorage.clear();
          setIsLoading(false);
          return;
        }

        // Appelle la fonction de contexte d'authentification avec le token et l'objet user complet
        // Le type de 'user' est déjà défini par l'interface UserData
        login(access_token, user); 
        
        // Stocke les informations nécessaires dans le local storage
        storeAuthData(access_token, user.role, user.id, user.name);

        // Redirection basée sur le rôle
        switch (user.role) {
          case 'stagiaire':
            navigate('/etudiant');
            break;
          case 'admin':
            navigate('/admin');
            break;
          case 'rh':
            navigate('/rh');
            break;
          case 'encadreur':
            navigate('/encadreur');
            break;
          default:
            setError('Rôle utilisateur non reconnu. Contactez l\'administrateur.');
            localStorage.clear();
            navigate('/login');
            break;
        }
      } else {
        // Si la structure de la réponse n'est pas celle attendue (pas de access_token ou pas d'objet user)
        setError('Format de réponse de connexion inattendu du serveur. Impossible de récupérer les informations utilisateur.');
        localStorage.clear();
        setIsLoading(false);
        return;
      }

    } catch (err: any) { // Capturez l'erreur de manière plus générique ou avec un type 'unknown' puis vérifiez
      console.error('Erreur réseau ou du serveur (catch block général) :', err);
      // Différenciez les erreurs pour un message plus spécifique
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setError('Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet ou que le serveur backend est démarré.');
      } else {
        setError(err.message || 'Une erreur inattendue est survenue lors de la connexion.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 pt-24 pb-20 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-4 sm:px-6 lg:px-8">
        <Card variant="elevated" padding="lg" className="w-full">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Connexion à ARTE</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Accédez à votre espace personnel
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-danger-100 dark:bg-danger-900/20 text-danger-700 dark:text-danger-300 rounded-xl flex items-center">
              <AlertCircle size={20} className="mr-2" />
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
                      selectedRoleUI === 'stagiaire'
                        ? 'border-agl-blue bg-blue-50 dark:bg-blue-900/20 text-agl-blue'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setSelectedRoleUI('stagiaire')}
                  >
                    <div className="flex items-center justify-center text-center">
                      <span className="font-medium">Stagiaire</span>
                    </div>
                  </div>

                  <div
                    className={`rounded-2xl border p-3 cursor-pointer transition-all ${
                      selectedRoleUI === 'encadreur'
                        ? 'border-agl-blue bg-blue-50 dark:bg-blue-900/20 text-agl-blue'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setSelectedRoleUI('encadreur')}
                  >
                    <div className="flex items-center justify-center text-center">
                      <span className="font-medium">Encadreur</span>
                    </div>
                  </div>

                  <div
                    className={`rounded-2xl border p-3 cursor-pointer transition-all ${
                      selectedRoleUI === 'rh'
                        ? 'border-agl-blue bg-blue-50 dark:bg-blue-900/20 text-agl-blue'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setSelectedRoleUI('rh')}
                  >
                    <div className="flex items-center justify-center text-center">
                      <span className="font-medium">RH</span>
                    </div>
                  </div>

                  <div
                    className={`rounded-2xl border p-3 cursor-pointer transition-all ${
                      selectedRoleUI === 'admin'
                        ? 'border-agl-blue bg-blue-50 dark:bg-blue-900/20 text-agl-blue'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-800'
                    }`}
                    onClick={() => setSelectedRoleUI('admin')}
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
                leftIcon={isLoading ? <RefreshCw size={18} className="animate-spin" /> : <LogIn size={18} />}
              >
                Se connecter
              </Button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pas encore inscrit ?{' '}
                <Link to="/register" className="text-agl-blue hover:underline cursor-pointer">
                  Créer un compte
                </Link>
              </p>
            </div>
          </form>
        </Card>

        {/* Informations de débogage - À SUPPRIMER EN PRODUCTION */}
        <div className="mt-8 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-semibold">
            Informations de test (à retirer en production)
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            **Backend Laravel requis :** Assurez-vous que votre serveur Laravel tourne et a des utilisateurs créés avec les rôles `stagiaire`, `admin`, `rh`, `encadreur`.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            **Exemple :**
            <br/> Email : `stagiaire@example.com`, Mot de passe : `password` (Rôle : `stagiaire`)
            <br/> Email : `admin@example.com`, Mot de passe : `password` (Rôle : `admin`)
            <br/> etc.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
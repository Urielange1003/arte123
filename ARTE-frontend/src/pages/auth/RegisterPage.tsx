// src/pages/Auth/RegisterPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchApi } from '../../services/api';
import { UserPlus, Mail, Lock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import Button from '../../components/ui/Button'; // Assurez-vous que ce chemin est correct
import Input from '../../components/ui/Input';   // Assurez-vous que ce chemin est correct
import Card from '../../components/ui/Card';     // Assurez-vous que ce chemin est correct


// Définissez les rôles disponibles
const ROLES = [
  { value: 'stagiaire', label: 'Stagiaire' },
  { value: 'encadreur', label: 'Encadreur' },
  { value: 'rh', label: 'Ressources Humaines' },
  // Le rôle admin ne devrait probablement pas être auto-attribué,
  // il devrait être attribué manuellement par un admin existant ou via une seeder.
  // { value: 'admin', label: 'Administrateur' },
];

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '', // Important pour la validation Laravel
    role: '', // Valeur par défaut vide
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({}); // Pour les erreurs de validation du backend

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Effacer les erreurs spécifiques au champ quand il est modifié
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    // Effacer les messages de succès/erreur globaux
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    setErrors({}); // Réinitialiser les erreurs précédentes

    try {
      const data = await fetchApi('register', {
        method: 'POST',
        data: formData,
      });

      setSuccessMessage((data as any).message || "Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
      setFormData({ // Réinitialiser le formulaire après succès
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
      });
    } catch (error: any) {
      console.error('Erreur lors de la soumission:', error);
      if (error?.cause?.errors) {
        setErrors(error.cause.errors);
        setErrorMessage("Erreur de validation. Veuillez vérifier les champs.");
      } else {
        setErrorMessage(error.message || "Une erreur est survenue lors de la création du compte.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 pt-24 pb-20 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full px-4 sm:px-6 lg:px-8">
        <Card variant="elevated" padding="lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Créer votre compte
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Inscrivez-vous pour accéder à la plateforme.
            </p>
          </div>

          {successMessage && (
            <div className="bg-success-100 dark:bg-success-900/20 border border-success-400 dark:border-success-700 text-success-700 dark:text-success-300 px-4 py-3 rounded-lg flex items-center mb-6" role="alert">
              <CheckCircle size={20} className="mr-3" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="bg-danger-100 dark:bg-danger-900/20 border border-danger-400 dark:border-danger-700 text-danger-700 dark:text-danger-300 px-4 py-3 rounded-lg flex items-center mb-6" role="alert">
              <AlertCircle size={20} className="mr-3" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Nom Complet"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              required
              fullWidth
              leftIcon={<UserPlus size={18} />}
              error={errors.name ? errors.name[0] : ''}
            />

            <Input
              label="Adresse Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              fullWidth
              leftIcon={<Mail size={18} />}
              error={errors.email ? errors.email[0] : ''}
            />

            <Input
              label="Mot de passe"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              fullWidth
              leftIcon={<Lock size={18} />}
              error={errors.password ? errors.password[0] : ''}
            />

            <Input
              label="Confirmer le mot de passe"
              name="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={handleInputChange}
              required
              fullWidth
              leftIcon={<Lock size={18} />}
              error={errors.password_confirmation ? errors.password_confirmation[0] : ''}
            />

            <div>
              <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                Type de compte (Rôle)
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`block w-full rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-agl-blue focus:ring-2 focus:ring-agl-blue/20 py-2.5 px-4 ${
                  errors.role ? 'border-danger-500 ring-danger-500' : ''
                }`}
                required
              >
                <option value="">Sélectionner un rôle</option>
                {ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="mt-2 text-sm text-danger-600 dark:text-danger-400">{errors.role[0]}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              leftIcon={isLoading ? <RefreshCw size={18} className="animate-spin" /> : <UserPlus size={18} />}
            >
              {isLoading ? 'Création en cours...' : 'Créer mon compte'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
            Vous avez déjà un compte ?{' '}
            <Link to="/login" className="text-agl-blue hover:underline font-medium">
              Connectez-vous ici
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
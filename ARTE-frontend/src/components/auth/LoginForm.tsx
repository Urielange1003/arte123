import React, { useState } from 'react';
import { login } from '../../services/api';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await login({ email, password });

      // Sauvegarde du token dans localStorage
      localStorage.setItem('authToken', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      const user = res.data.user;

      if (!user.role) {
        setErrorMessage("La réponse du serveur ne contient pas de rôle utilisateur. Contactez l'administrateur.");
        setLoading(false);
        return;
      }

      if (user.force_password_change) {
        navigate('/update-password');
      } else {
        switch (user.role) {
          case 'stagiaire':
            navigate('/stagiaire/dashboard');
            break;
          case 'encadreur':
            navigate('/encadreur/dashboard');
            break;
          case 'rh':
            navigate('/rh/dashboard');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          default:
            setErrorMessage('Rôle non reconnu');
        }
      }
    } catch (error) {
      setErrorMessage('❌ Échec de connexion. Vérifiez vos identifiants.');
      console.error('Erreur de connexion:', error);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 shadow-md rounded-md max-w-md mx-auto text-center">
      <h2 className="text-xl font-bold mb-4">Connexion</h2>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <div className="mb-2">
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-3 border-2 border-blue-500 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          required 
        />
      </div>
      <div className="mb-2">
        <input 
          type="password" 
          placeholder="Mot de passe" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-3 border-2 border-blue-500 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          required 
        />
      </div>
      <button 
        type="submit" 
        disabled={loading} 
        className={`px-4 py-2 mt-2 w-full text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        {loading ? 'Connexion en cours...' : 'Se connecter'}
      </button>
    </form>
  );
}

export default LoginForm;
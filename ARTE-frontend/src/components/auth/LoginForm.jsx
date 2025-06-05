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

      // Sauvegarde du token dans `sessionStorage` pour plus de sécurité
      sessionStorage.setItem('token', res.data.token);

      const user = res.data.user;

      if (user.force_password_change) {
        navigate('/update-password'); // Rediriger vers mise à jour du mot de passe
      } else {
        navigate('/stagiaire/dashboard');
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
          className="w-full p-3 border-2 border-blue-500 rounded-xl text-lg focus:outline-none focus: ring-2 focus:rinf-blue-500" 
          required 
        />
      </div>

      <div className="mb-2">
        <input 
          type="password" 
          placeholder="Mot de passe" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-3 border-2 border-blue-500 rounded-xl text-lg focus:outline-none focus: ring-2 focus:rinf-blue-500" 
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

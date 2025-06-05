import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await api.put(
        '/user/update-password',
        { 
          old_password: oldPassword, 
          new_password: newPassword, 
          new_password_confirmation: newPasswordConfirmation 
        },
        {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        }
      );

      setMessage('✅ Mot de passe mis à jour avec succès.');
      setOldPassword('');
      setNewPassword('');
      setNewPasswordConfirmation('');

      // Redirection après mise à jour
      setTimeout(() => navigate('/stagiaire/dashboard'), 1500);
      
    } catch (error) {
      setMessage('❌ Erreur lors de la mise à jour du mot de passe.');
      console.error('Erreur API:', error);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-100 shadow-md rounded-md max-w-md mx-auto text-center">
      <h2 className="text-xl font-semibold mb-4">Modifier votre mot de passe</h2>

      {message && <p className="text-red-500 font-semibold">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input 
          type="password" 
          placeholder="Ancien mot de passe" 
          value={oldPassword} 
          onChange={(e) => setOldPassword(e.target.value)} 
          className="w-full p-2 border rounded-md" 
          required 
        />
        <input 
          type="password" 
          placeholder="Nouveau mot de passe" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
          className="w-full p-2 border rounded-md" 
          required 
        />
        <input 
          type="password" 
          placeholder="Confirmez le nouveau mot de passe" 
          value={newPasswordConfirmation} 
          onChange={(e) => setNewPasswordConfirmation(e.target.value)} 
          className="w-full p-2 border rounded-md" 
          required 
        />
        <button 
          type="submit" 
          disabled={loading} 
          className={`px-4 py-2 w-full text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {loading ? 'Mise à jour...' : 'Mettre à jour'}
        </button>
      </form>
    </div>
  );
}

export default UpdatePassword;

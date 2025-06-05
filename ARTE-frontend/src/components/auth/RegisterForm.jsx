import React, { useState } from 'react';
import { register } from '../../services/api';

function RegisterForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Le nom est requis';
    if (!form.email.includes('@')) newErrors.email = 'Email invalide';
    if (form.password.length < 6) newErrors.password = 'Mot de passe trop court (min 6 caractères)';
    if (form.password !== form.password_confirmation) newErrors.password_confirmation = 'Les mots de passe ne correspondent pas';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(form);
      alert('Inscription réussie !');
      setForm({ name: '', email: '', password: '', password_confirmation: '' });
      setErrors({});
    } catch (error) {
      alert('Erreur lors de l’inscription');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 shadow-md rounded-md max-w-md mx-auto">
      <h2 className="text-xl font-bold text-center mb-4">Inscription</h2>
      {Object.keys(form).map((key) => (
        <div key={key} className="mb-2">
          <input
            name={key}
            placeholder={key.replace(/_/g, ' ')}
            value={form[key]}
            onChange={handleChange}
            type={key.includes('password') ? 'password' : 'text'}
            className="w-full p-3 border-2 border-blue-500 rounded-xl text-lg focus:outline-none focus: ring-2 focus:rinf-blue-500"
          />
          {errors[key] && <p className="text-red-500 text-sm">{errors[key]}</p>}
        </div>
      ))}
      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 mt-2 w-full text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        {loading ? 'Inscription en cours...' : "S'inscrire"}
      </button>
    </form>
  );
}

export default RegisterForm;

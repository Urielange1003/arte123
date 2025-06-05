import React, { useState } from 'react';
import { submitCandidature } from '../services/api';

function CandidatureForm() {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    date_naissance: '',
    adresse: '',
    etablissement: '',
    formation: '',
    niveau: '',
    stage_requis: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!form.nom) newErrors.nom = 'Le nom est requis';
    if (!form.email.includes('@')) newErrors.email = 'Email invalide';
    if (!form.telephone.match(/^[0-9]{10}$/)) newErrors.telephone = 'Numéro invalide';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await submitCandidature(form);
      alert('Candidature envoyée avec succès !');
      setForm({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        date_naissance: '',
        adresse: '',
        etablissement: '',
        formation: '',
        niveau: '',
        stage_requis: '',
      });
      setErrors({});
    } catch (error) {
      console.error(error);
      alert('Erreur lors de l’envoi');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 shadow-md rounded-md">
      <h2 className="text-xl font-bold text-center mb-4">Formulaire de Candidature</h2>
      {Object.keys(form).map((key) => (
        <div key={key} className="mb-2">
          <input
            name={key}
            placeholder={key.replace(/_/g, ' ')}
            value={form[key]}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
          {errors[key] && <p className="text-red-500 text-sm">{errors[key]}</p>}
        </div>
      ))}
      <button 
        type="submit" 
        disabled={loading} 
        className={`px-4 py-2 mt-2 w-full text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        {loading ? 'Envoi en cours...' : 'Soumettre'}
      </button>
    </form>
  );
}

export default CandidatureForm;

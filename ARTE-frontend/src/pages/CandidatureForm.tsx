import React, { useState } from 'react';
// Assurez-vous que ce chemin est correct pour votre service API
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
  const [submissionMessage, setSubmissionMessage] = useState(''); // Pour afficher les messages de succès ou d'erreur générale

  /**
   * Met à jour l'état du formulaire lorsqu'un champ change.
   * Efface également l'erreur spécifique à ce champ s'il y en avait une.
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[e.target.name];
        return newErrors;
      });
    }
  };

  /**
   * Valide les champs du formulaire et met à jour l'état des erreurs.
   * @returns {boolean} Vrai si le formulaire est valide, faux sinon.
   */
  const validateForm = () => {
    let newErrors = {};
    if (!form.nom.trim()) newErrors.nom = 'Le nom est requis.';
    if (!form.prenom.trim()) newErrors.prenom = 'Le prénom est requis.';

    if (!form.email.trim()) {
      newErrors.email = 'L\'email est requis.';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email invalide.';
    }

    if (!form.telephone.trim()) {
      newErrors.telephone = 'Le numéro de téléphone est requis.';
    } else if (!/^[0-9]{10}$/.test(form.telephone)) {
      newErrors.telephone = 'Numéro de téléphone invalide (doit contenir 10 chiffres).';
    }

    if (!form.date_naissance) newErrors.date_naissance = 'La date de naissance est requise.';
    if (!form.adresse.trim()) newErrors.adresse = 'L\'adresse est requise.';
    if (!form.etablissement.trim()) newErrors.etablissement = 'L\'établissement est requis.';
    if (!form.formation.trim()) newErrors.formation = 'La formation est requise.';
    if (!form.niveau.trim()) newErrors.niveau = 'Le niveau est requis.';
    if (!form.stage_requis.trim()) newErrors.stage_requis = 'Le champ "stage requis" est requis.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Gère la soumission du formulaire.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionMessage(''); // Efface les messages de soumission précédents

    if (!validateForm()) {
      setSubmissionMessage('Veuillez corriger les erreurs dans le formulaire.');
      return;
    }

    setLoading(true);
    setErrors({}); // Efface les erreurs spécifiques aux champs avant la soumission

    try {
      // Crée un objet FormData pour envoyer les données, y compris potentiellement des fichiers
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));

      // Appel au service API pour soumettre la candidature
      // Assurez-vous que 'submitCandidature' dans '../services/api' gère l'envoi de FormData
      await submitCandidature(formData);

      setSubmissionMessage('Candidature envoyée avec succès !');
      // Réinitialise le formulaire après une soumission réussie
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
    } catch (error) {
      console.error('Erreur lors de la soumission :', error);
      // Affiche un message d'erreur général à l'utilisateur
      setSubmissionMessage(error.message || 'Une erreur est survenue lors de l’envoi de votre candidature.');
      setErrors({ global: error.message || 'Erreur de soumission.' }); // Définit une erreur globale
    } finally {
      setLoading(false); // Arrête l'indicateur de chargement
    }
  };

  // Définit les champs du formulaire avec des types et des libellés spécifiques pour un meilleur rendu
  const formFields = [
    { name: 'nom', label: 'Nom', type: 'text', placeholder: 'Votre nom' },
    { name: 'prenom', label: 'Prénom', type: 'text', placeholder: 'Votre prénom' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Votre email' },
    { name: 'telephone', label: 'Téléphone', type: 'tel', placeholder: 'Votre numéro de téléphone (10 chiffres)' },
    { name: 'date_naissance', label: 'Date de naissance', type: 'date' },
    { name: 'adresse', label: 'Adresse', type: 'text', placeholder: 'Votre adresse complète' },
    { name: 'etablissement', label: 'Établissement', type: 'text', placeholder: 'Nom de votre établissement' },
    { name: 'formation', label: 'Formation', type: 'text', placeholder: 'Votre domaine de formation' },
    { name: 'niveau', label: 'Niveau d\'études', type: 'text', placeholder: 'Ex: Licence 3, Master 1' },
    {
      name: 'stage_requis',
      label: 'Type de Stage Requis',
      type: 'select',
      options: [
        { value: '', label: 'Sélectionnez un type de stage' },
        { value: 'obligatoire', label: 'Stage Obligatoire' },
        { value: 'facultatif', label: 'Stage Facultatif' },
      ]
    },
    // Ajoutez d'autres champs si nécessaire, par exemple, pour télécharger un CV :
    // { name: 'cv_file', label: 'Téléchargez votre CV', type: 'file' },
  ];

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-lg rounded-lg max-w-lg mx-auto my-8">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Formulaire de Candidature</h2>

      {/* Affichage des messages de soumission (succès ou erreur générale) */}
      {submissionMessage && (
        <div className={`p-3 mb-4 rounded-md text-center ${submissionMessage.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {submissionMessage}
        </div>
      )}

      {/* Rendu dynamique des champs du formulaire */}
      {formFields.map((field) => (
        <div key={field.name} className="mb-4">
          <label htmlFor={field.name} className="block text-gray-700 text-sm font-bold mb-2 capitalize">
            {field.label} {field.type !== 'file' ? <span className="text-red-500">*</span> : null} {/* Indique les champs requis */}
          </label>
          {field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder || field.label}
              value={form[field.name]}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          {/* Affichage des erreurs spécifiques au champ */}
          {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
        </div>
      ))}

      {/* Affichage d'une erreur globale si présente */}
      {errors.global && <p className="text-red-500 text-sm mb-4 text-center">{errors.global}</p>}

      {/* Bouton de soumission */}
      <button
        type="submit"
        disabled={loading} // Désactive le bouton pendant le chargement
        className={`px-6 py-3 mt-4 w-full text-white font-bold rounded-md transition-colors duration-200 ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'}`}
      >
        {loading ? 'Envoi en cours...' : 'Soumettre ma candidature'}
      </button>
    </form>
  );
}

export default CandidatureForm;
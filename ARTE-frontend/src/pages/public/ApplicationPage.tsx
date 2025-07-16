import React, { useState, useRef } from 'react'; // Importez useRef
import { FileText, Send, Upload, Calendar, CalendarRange, CreditCard, XCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
// Si vous avez un fichier api.ts ou api.js pour vos appels API
import { fetchApi } from '../../services/api'; // Décommentez si vous utilisez votre fetchApi personnalisé

const ApplicationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    field: '',
    school: '',
    duration: '',
    startDate: '',
    endDate: '',
    motivation: '',
  });

  const [files, setFiles] = useState<{
    cv: File | null;
    certificate: File | null;
    cni: File | null;
  }>({
    cv: null,
    certificate: null,
    cni: null,
  });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Refs pour les inputs de type file
  const cvInputRef = useRef<HTMLInputElement>(null);
  const certificateInputRef = useRef<HTMLInputElement>(null);
  const cniInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on input change
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'cv' | 'certificate' | 'cni') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, [fileType]: 'Le fichier est trop volumineux (max 5MB).' }));
        setFiles(prev => ({ ...prev, [fileType]: null })); // Réinitialise le fichier si trop gros
        return;
      }
      // Vérifie le type de fichier (assurez-vous que ce soit bien un PDF si requis)
      if (file.type !== 'application/pdf') {
        setErrors(prev => ({ ...prev, [fileType]: 'Seuls les fichiers PDF sont autorisés.' }));
        setFiles(prev => ({ ...prev, [fileType]: null }));
        return;
      }

      setFiles(prev => ({ ...prev, [fileType]: file }));
      setErrors(prev => ({ ...prev, [fileType]: '' })); // Clear error on file change
    } else {
      setFiles(prev => ({ ...prev, [fileType]: null }));
      setErrors(prev => ({ ...prev, [fileType]: `Le ${fileType.toUpperCase()} est requis.` })); // Ajoute l'erreur si le fichier est désélectionné
    }
  };

  // Fonctions pour déclencher le clic sur l'input file caché
  const triggerCvInput = () => {
    cvInputRef.current?.click();
  };

  const triggerCertificateInput = () => {
    certificateInputRef.current?.click();
  };

  const triggerCniInput = () => {
    cniInputRef.current?.click();
  };

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullName) newErrors.fullName = 'Le nom complet est requis.';
    if (!formData.email) newErrors.email = 'L\'email est requis.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Format d\'email invalide.';
    if (!formData.phone) newErrors.phone = 'Le numéro de téléphone est requis.';
    if (!formData.field) newErrors.field = 'La filière est requise.';
    if (!formData.school) newErrors.school = 'L\'établissement scolaire est requis.';
    if (!formData.duration) newErrors.duration = 'La durée du stage est requise.';
    if (!formData.startDate) newErrors.startDate = 'La date de début est requise.';
    if (!formData.endDate) newErrors.endDate = 'La date de fin est requise.';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'La date de fin ne peut pas être antérieure à la date de début.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!files.cv) newErrors.cv = 'Le CV est requis.';
    if (!files.certificate) newErrors.certificate = 'Le certificat de scolarité est requis.';
    if (!files.cni) newErrors.cni = 'La CNI est requise.';
    if (!formData.motivation) newErrors.motivation = 'La lettre de motivation est requise.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(prev => prev + 1);
        window.scrollTo(0, 0);
      }
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(prev => prev + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Re-valider toutes les étapes avant la soumission finale
    if (!validateStep1() || !validateStep2()) {
      alert('Veuillez remplir tous les champs requis et télécharger tous les documents.');
      // Si la validation échoue, revenez à la première étape avec des erreurs visibles
      if (!validateStep1()) setStep(1);
      else if (!validateStep2()) setStep(2);
      window.scrollTo(0, 0);
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key as keyof typeof formData]);
      }
      if (files.cv) data.append('cv', files.cv);
      if (files.certificate) data.append('certificate', files.certificate);
      if (files.cni) data.append('cni', files.cni);

      // Utilisation du helper fetchApi (gère automatiquement les en-têtes et les erreurs)
      const result = await fetchApi('apply', {
        method: 'POST',
        data,
      });

      console.log(result); // Réponse du serveur

      setTimeout(() => { // Simulate network delay
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 2000);

    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      alert(`Une erreur est survenue lors de la soumission de votre candidature: ${(error as Error).message}. Veuillez réessayer.`);
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="elevated" padding="lg" className="text-center">
            <div className="rounded-full bg-success-100 dark:bg-success-900/20 p-4 mx-auto w-20 h-20 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-success-600 dark:text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Candidature envoyée avec succès !
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Votre candidature a été reçue et sera examinée par notre équipe. Vous recevrez bientôt un email de confirmation avec les détails de votre candidature.
            </p>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Référence de candidature: <span className="font-mono font-medium">APP-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span>
              </p>

              <Button
                variant="primary"
                onClick={() => window.location.href = '/'}
              >
                Retour à l'accueil
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Postuler pour un stage chez Camrail
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Remplissez le formulaire ci-dessous pour soumettre votre candidature
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`rounded-full h-10 w-10 flex items-center justify-center ${
                step >= 1 ? 'bg-agl-blue text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                1
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  step >= 1 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                }`}>Informations personnelles</p>
              </div>
            </div>

            <div className={`flex-grow border-t border-gray-300 dark:border-gray-600 mx-4 ${
              step >= 2 ? 'border-agl-blue' : ''
            }`}></div>
            <div className="flex items-center">
              <div className={`rounded-full h-10 w-10 flex items-center justify-center ${
                step >= 2 ? 'bg-agl-blue text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                2
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  step >= 2 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                }`}>Documents</p>
              </div>
            </div>
            <div className={`flex-grow border-t border-gray-300 dark:border-gray-600 mx-4 ${
              step >= 3 ? 'border-agl-blue' : ''
            }`}></div>

            <div className="flex items-center">
              <div className={`rounded-full h-10 w-10 flex items-center justify-center ${
                step >= 3 ? 'bg-agl-blue text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                3
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  step >= 3 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                }`}>Confirmation</p>
              </div>
            </div>
          </div>
        </div>

        <Card variant="elevated" padding="lg">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Informations personnelles
                </h2>

                <Input
                  label="Nom complet"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  error={errors.fullName}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    error={errors.email}
                  />

                  <Input
                    label="Téléphone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    error={errors.phone}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label htmlFor="field" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                      Filière ou spécialité
                    </label>
                    <select
                      id="field"
                      name="field"
                      value={formData.field}
                      onChange={handleInputChange}
                      className={`block w-full rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2.5 px-4 ${
                        errors.field ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:border-agl-blue focus:ring-2 focus:ring-agl-blue/20`}
                      required
                    >
                      <option value="">Sélectionner</option>
                      <option value="informatique">Informatique</option>
                      <option value="genie_civil">Génie Civil</option>
                      <option value="electromecanique">Électromécanique</option>
                      <option value="ressources_humaines">Ressources Humaines</option>
                      <option value="logistique">Logistique & Transport</option>
                      <option value="gestion">Gestion & Finance</option>
                      <option value="autre">Autre</option>
                    </select>
                    {errors.field && <p className="text-red-500 text-sm mt-1 flex items-center"><XCircle size={14} className="inline mr-1" />{errors.field}</p>}
                  </div>

                  <Input
                    label="Établissement scolaire"
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    error={errors.school}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="mb-4">
                    <label htmlFor="duration" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                      Durée du stage (mois)
                    </label>
                    <select
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className={`block w-full rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2.5 px-4 ${
                        errors.duration ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:border-agl-blue focus:ring-2 focus:ring-agl-blue/20`}
                      required
                    >
                      <option value="">Sélectionner</option>
                      <option value="1">1 mois</option>
                      <option value="2">2 mois</option>
                      <option value="3">3 mois</option>
                      <option value="4">4 mois</option>
                      <option value="5">5 mois</option>
                      <option value="6">6 mois</option>
                    </select>
                    {errors.duration && <p className="text-red-500 text-sm mt-1 flex items-center"><XCircle size={14} className="inline mr-1" />{errors.duration}</p>}
                  </div>

                  <Input
                    label="Date de début souhaitée"
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    leftIcon={<Calendar size={18} />}
                    error={errors.startDate}
                  />

                  <Input
                    label="Date de fin souhaitée"
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    fullWidth
                    leftIcon={<CalendarRange size={18} />}
                    error={errors.endDate}
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    type="button"
                    variant="primary"
                    rightIcon={<FileText size={18} />}
                    onClick={nextStep}
                  >
                    Suivant: Documents
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Documents */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Documents requis
                </h2>

                {/* CV Upload */}
                <div className={`border-2 border-dashed rounded-xl p-6 mb-6 ${errors.cv ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}>
                  <div className="flex flex-col items-center justify-center">
                    <Upload size={36} className="text-gray-400 dark:text-gray-500 mb-3" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      CV (format PDF)
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Taille maximale: 5MB
                    </p>
                    <input
                      type="file"
                      id="cv"
                      ref={cvInputRef}
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, 'cv')}
                      // required // Géré par validateStep2
                    />
                    {/* Le label est maintenant un wrapper pour le bouton qui déclenchera l'input caché */}
                    <Button
                      type="button" // Important pour ne pas soumettre le formulaire
                      variant="outline"
                      size="sm"
                      leftIcon={<Upload size={16} />}
                      onClick={triggerCvInput} // Appel de la fonction qui clique sur l'input
                    >
                      Sélectionner un fichier
                    </Button>
                    {files.cv && (
                      <p className="mt-2 text-sm text-success-600 dark:text-success-400">
                        {files.cv.name}
                      </p>
                    )}
                    {errors.cv && <p className="text-red-500 text-sm mt-1 flex items-center"><XCircle size={14} className="inline mr-1" />{errors.cv}</p>}
                  </div>
                </div>

                {/* Certificate Upload */}
                <div className={`border-2 border-dashed rounded-xl p-6 mb-6 ${errors.certificate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}>
                  <div className="flex flex-col items-center justify-center">
                    <Upload size={36} className="text-gray-400 dark:text-gray-500 mb-3" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Certificat de scolarité (format PDF)
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Taille maximale: 5MB
                    </p>
                    <input
                      type="file"
                      id="certificate"
                      ref={certificateInputRef}
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, 'certificate')}
                      // required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      leftIcon={<Upload size={16} />}
                      onClick={triggerCertificateInput}
                    >
                      Sélectionner un fichier
                    </Button>
                    {files.certificate && (
                      <p className="mt-2 text-sm text-success-600 dark:text-success-400">
                        {files.certificate.name}
                      </p>
                    )}
                    {errors.certificate && <p className="text-red-500 text-sm mt-1 flex items-center"><XCircle size={14} className="inline mr-1" />{errors.certificate}</p>}
                  </div>
                </div>

                {/* CNI Upload (New) */}
                <div className={`border-2 border-dashed rounded-xl p-6 mb-6 ${errors.cni ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}>
                  <div className="flex flex-col items-center justify-center">
                    <CreditCard size={36} className="text-gray-400 dark:text-gray-500 mb-3" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Carte Nationale d'Identité (CNI) (format PDF)
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Taille maximale: 5MB
                    </p>
                    <input
                      type="file"
                      id="cni"
                      ref={cniInputRef}
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, 'cni')}
                      // required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      leftIcon={<Upload size={16} />}
                      onClick={triggerCniInput}
                    >
                      Sélectionner un fichier
                    </Button>
                    {files.cni && (
                      <p className="mt-2 text-sm text-success-600 dark:text-success-400">
                        {files.cni.name}
                      </p>
                    )}
                    {errors.cni && <p className="text-red-500 text-sm mt-1 flex items-center"><XCircle size={14} className="inline mr-1" />{errors.cni}</p>}
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="motivation" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    Lettre de motivation
                  </label>
                  <textarea
                    id="motivation"
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    rows={6}
                    className={`block w-full rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-2.5 px-4 ${
                      errors.motivation ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } focus:border-agl-blue focus:ring-2 focus:ring-agl-blue/20`}
                    required
                  ></textarea>
                  {errors.motivation && <p className="text-red-500 text-sm mt-1 flex items-center"><XCircle size={14} className="inline mr-1" />{errors.motivation}</p>}
                </div>

                <div className="pt-4 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                  >
                    Retour
                  </Button>

                  <Button
                    type="button"
                    variant="primary"
                    rightIcon={<Send size={18} />}
                    onClick={nextStep}
                  >
                    Suivant: Confirmation
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Confirmation des informations
                </h2>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Informations personnelles
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Nom complet</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.fullName}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.email}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Téléphone</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.phone}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Filière</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.field}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Établissement</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.school}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Durée du stage</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.duration} mois</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Date de début</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.startDate}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Date de fin</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.endDate}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Documents
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FileText size={20} className="text-agl-blue mr-2" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        CV: {files.cv ? files.cv.name : 'Non téléchargé'}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <FileText size={20} className="text-agl-blue mr-2" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Certificat de scolarité: {files.certificate ? files.certificate.name : 'Non téléchargé'}
                      </p>
                    </div>

                    {/* CNI confirmation (New) */}
                    <div className="flex items-center">
                      <CreditCard size={20} className="text-agl-blue mr-2" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        CNI: {files.cni ? files.cni.name : 'Non téléchargé'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Lettre de motivation
                  </h3>

                  <p className="text-sm text-gray-900 dark:text-white whitespace-pre-line">
                    {formData.motivation}
                  </p>
                </div>

                <div className="pt-4 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                  >
                    Retour
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    leftIcon={<Send size={18} />}
                  >
                    Soumettre ma candidature
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationPage;
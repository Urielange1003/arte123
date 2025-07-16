import React from 'react';

const UploadButton = () => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Fichier sélectionné :", file.name);
    }
  };

  return (
    <div className="mt-4">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        id="cv-upload"
        style={{ display: 'none' }}
      />
      
      <label htmlFor="cv-upload">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
          📎 Sélectionner un fichier
        </button>
      </label>
    </div>
  );
};

export default UploadButton;

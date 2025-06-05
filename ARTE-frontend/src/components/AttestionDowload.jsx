import React from "react";

const downloadAttestation = async (id) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`http://localhost:8000/api/attestation/${id}/generer`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attestation_${id}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url); // Nettoyer l'URL après utilisation
  } catch (error) {
    alert(`Échec du téléchargement : ${error.message}`);
  }
};

const AttestationDownload = ({ stagiaireId }) => {
  return (
    <button
      onClick={() => downloadAttestation(stagiaireId)}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Télécharger l’attestation
    </button>
  );
};

export default AttestationDownload;

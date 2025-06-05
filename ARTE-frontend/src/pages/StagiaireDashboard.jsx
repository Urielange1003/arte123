import React from 'react';
import PresenceForm from '../components/Stage/PresenceForm';
import RapportJournalier from '../components/Stage/RapportJournalier';
import RapportFinalUploader from '../components/Stage/RapportFinalUploader';
import DiscussionBox from '../components/Stage/DiscussionBox';
import PresenceJournal from '../components/Stagiaires/PresenceJournal';
import TachesDuJour from '../components/Stagiaires/TachesDuJour';
import RapportUploader from '../components/Stagiaires/RapportUploader';
import ChatWithEncadreur from '../components/Stagiaires/ChatWithEncadreur';

function StagiaireDashboard() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">Bienvenue sur votre interface stagiaire</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Présence */}
        <div className="p-4 bg-white shadow-md rounded-md">
          <PresenceForm />
        </div>
        <div className="p-4 bg-white shadow-md rounded-md">
          <PresenceJournal />
        </div>

        {/* Tâches du jour et Rapports */}
        <div className="p-4 bg-white shadow-md rounded-md">
          <TachesDuJour />
        </div>
        <div className="p-4 bg-white shadow-md rounded-md">
          <RapportJournalier />
        </div>

        {/* Gestion des rapports */}
        <div className="p-4 bg-white shadow-md rounded-md">
          <RapportFinalUploader />
        </div>
        <div className="p-4 bg-white shadow-md rounded-md">
          <RapportUploader />
        </div>

        {/* Communication */}
        <div className="p-4 bg-white shadow-md rounded-md">
          <DiscussionBox />
        </div>
        <div className="p-4 bg-white shadow-md rounded-md">
          <ChatWithEncadreur />
        </div>
      </div>
    </div>
  );
}

export default StagiaireDashboard;

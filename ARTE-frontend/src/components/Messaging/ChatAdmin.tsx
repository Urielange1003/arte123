import React, { useEffect, useState, useRef } from 'react';
import api from '../../services/api';

function ChatAdmin({ stagiaireId }) {
  const [messages, setMessages] = useState([]);
  const [texte, setTexte] = useState('');
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await api.get(`/admin/messages/${stagiaireId}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Erreur lors du chargement des messages:', err);
      }
    };

    loadMessages();
  }, [stagiaireId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!texte.trim()) {
      alert("❌ Le message ne peut pas être vide.");
      return;
    }

    setLoading(true);
    try {
      await api.post(`/admin/messages/${stagiaireId}`, { message: texte });
      setMessages((prev) => [...prev, { message: texte, sender: 'admin' }]);
      setTexte('');
    } catch (err) {
      console.error("Erreur d'envoi du message:", err);
      alert("❌ Erreur lors de l'envoi.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md max-w-md mx-auto text-center">
      <h3 className="text-xl font-semibold mb-4">Messagerie avec le stagiaire #{stagiaireId}</h3>
      <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-md p-2 bg-white">
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div key={idx} className="py-1 text-gray-700 border-b border-gray-200">
              <strong>{msg.sender}:</strong> {msg.message}
            </div>
          ))
        ) : (
          <p className="text-gray-500">Aucun message pour le moment.</p>
        )}
        <div ref={messageEndRef} />
      </div>
      <input
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        placeholder="Votre message..."
        className="w-full mt-2 p-2 border rounded-md"
      />
      <button
        onClick={sendMessage}
        disabled={loading}
        className={`px-4 py-2 mt-2 text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        {loading ? 'Envoi en cours...' : 'Envoyer'}
      </button>
    </div>
  );
}

export default ChatAdmin;

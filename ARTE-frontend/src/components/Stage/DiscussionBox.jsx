import React, { useEffect, useState, useRef } from 'react';
import api from '../../services/api';

function DiscussionBox() {
  const [messages, setMessages] = useState([]);
  const [texte, setTexte] = useState('');
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null); // Référence pour faire défiler automatiquement

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get('/stagiaire/messages');
        setMessages(res.data);
      } catch (err) {
        console.error('Erreur de récupération des messages:', err);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    // Scroll automatique vers le dernier message
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!texte.trim()) {
      setMessages((prev) => [...prev, { message: '❌ Message vide !', error: true }]);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/stagiaire/messages', { message: texte });
      setMessages((prev) => [...prev, res.data]); // Ajoute le message depuis la réponse API
      setTexte('');
    } catch (err) {
      console.error('Erreur lors de l’envoi du message:', err);
      setMessages((prev) => [...prev, { message: '❌ Erreur lors de l’envoi.', error: true }]);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md max-w-md mx-auto text-center">
      <h3 className="text-xl font-semibold mb-4">Messagerie</h3>
      
      <div className="max-h-48 overflow-y-scroll border border-gray-300 rounded-md p-2 bg-white">
        {messages.length > 0 ? (
          messages.map((msg, i) => (
            <div 
              key={i} 
              className={`py-1 border-b border-gray-200 ${msg.error ? 'text-red-500' : 'text-gray-700'}`}
            >
              {msg.message}
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
        {loading ? '⏳ Envoi en cours...' : 'Envoyer'}
      </button>
    </div>
  );
}

export default DiscussionBox;

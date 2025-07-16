import React, { useState, useEffect } from 'react';
import { Search, Send, MoreVertical, Phone, Camera as VideoCamera } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  online: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
}

interface Message {
  id: number;
  senderId: string;
  text: string;
  timestamp: string;
}

const SupervisorMessages: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState('');

  // Charger les contacts (stagiaires encadrés)
  useEffect(() => {
    const fetchContacts = async () => {
      setLoadingContacts(true);
      setError('');
      try {
        // À adapter selon ton backend
        const res = await api.get('/encadreur/stagiaires');
        // Transforme la réponse pour correspondre à l'interface Contact
        const contactsData: Contact[] = res.data.map((s: any) => ({
          id: s.id,
          name: s.name,
          role: 'Stagiaire',
          avatar: s.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0,2),
          online: true, // ou s.online si dispo
          lastMessage: '', // à remplir après fetch des messages
          lastMessageTime: '', // idem
          unread: 0
        }));
        setContacts(contactsData);
        if (contactsData.length > 0) setSelectedContact(contactsData[0].id);
      } catch (err) {
        setError("Erreur lors du chargement des contacts.");
      } finally {
        setLoadingContacts(false);
      }
    };
    fetchContacts();
  }, []);

  // Charger les messages du contact sélectionné
  useEffect(() => {
    if (!selectedContact) {
      setMessages([]);
      return;
    }
    const fetchMessages = async () => {
      setLoadingMessages(true);
      setError('');
      try {
        // À adapter selon ton backend (ex: `/messages/${selectedContact}`)
        const res = await api.get(`/encadreur/messages/${selectedContact}`);
        setMessages(res.data);
      } catch (err) {
        setError("Erreur lors du chargement des messages.");
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [selectedContact]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedContact) return;
    try {
      // À adapter selon ton backend
      await api.post(`/encadreur/messages/${selectedContact}`, {
        text: messageInput
      });
      setMessageInput('');
      // Recharge les messages après envoi
      const res = await api.get(`/encadreur/messages/${selectedContact}`);
      setMessages(res.data);
    } catch (err) {
      setError("Erreur lors de l'envoi du message.");
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)]">
      <Card variant="default" className="h-full">
        <div className="h-full flex">
          {/* Contacts sidebar */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <Input
                placeholder="Rechercher un stagiaire..."
                leftIcon={<Search size={18} />}
                fullWidth
                // Ajoute ici la logique de recherche si besoin
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {loadingContacts ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">Chargement...</div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
              ) : contacts.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">Aucun contact</div>
              ) : (
                contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      selectedContact === contact.id ? 'bg-gray-50 dark:bg-gray-800' : ''
                    }`}
                    onClick={() => setSelectedContact(contact.id)}
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                          <span className="text-sm font-medium text-agl-blue">
                            {contact.avatar}
                          </span>
                        </div>
                        {contact.online && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success-500 border-2 border-white dark:border-gray-800"></div>
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {contact.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {contact.lastMessageTime}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {contact.role}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">
                          {contact.lastMessage}
                        </p>
                      </div>
                    </div>
                    {contact.unread > 0 && (
                      <div className="mt-2 flex justify-end">
                        <span className="bg-camrail-red text-white text-xs font-medium px-2 py-1 rounded-full">
                          {contact.unread}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {selectedContact ? (
              <>
                {/* Chat header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <span className="text-sm font-medium text-agl-blue">
                        {contacts.find(c => c.id === selectedContact)?.avatar}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {contacts.find(c => c.id === selectedContact)?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {contacts.find(c => c.id === selectedContact)?.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="rounded-full">
                      <Phone size={18} />
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-full">
                      <VideoCamera size={18} />
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-full">
                      <MoreVertical size={18} />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loadingMessages ? (
                    <div className="text-center text-gray-500 dark:text-gray-400">Chargement...</div>
                  ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400">Aucun message</div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === selectedContact ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`max-w-[70%] ${
                          message.senderId === selectedContact
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-t-2xl rounded-r-2xl'
                            : 'bg-agl-blue text-white rounded-t-2xl rounded-l-2xl'
                        } px-4 py-2`}>
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderId === selectedContact
                              ? 'text-gray-500 dark:text-gray-400'
                              : 'text-blue-100'
                          }`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <Input
                      placeholder="Écrivez votre message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      fullWidth
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      className="rounded-full h-10 w-10 p-0 flex items-center justify-center"
                      disabled={!messageInput.trim()}
                    >
                      <Send size={18} />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Sélectionnez un stagiaire pour commencer une conversation
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SupervisorMessages;
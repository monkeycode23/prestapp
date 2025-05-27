import React,{ useState } from "react";

export default function ChatRoom() {

    /* const { socket, onlineUsers } = useSocket();
    const { user: currentUser } = useAuth(); // Assuming user in AuthContext is the current client
    
    const [contacts, setContacts] = useState<ChatContact[]>([]);
    const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const fetchContacts = async () => {
        try {
          const fetchedContacts = await apiService.getChatContacts();
          setContacts(fetchedContacts || []);
        } catch (error) {
          console.error('Error fetching contacts:', error);
        }
      };
    
      const fetchMessages = async (contactId: string) => {
        if (!contactId) return;
        try {
          const fetchedMessages = await apiService.getChatHistory(contactId);
          setMessages(fetchedMessages || []);
          // Mark messages as read could also be handled here or via socket event
        } catch (error) {
          console.error('Error fetching messages for contact:', contactId, error);
        }
      };
    
      useEffect(() => {
        fetchContacts();
      }, []);
    
      useEffect(() => {
        if (selectedContact) {
          fetchMessages(selectedContact.user._id);
        }
      }, [selectedContact]);
    
      useEffect(() => {
        if (socket) {
          const handleReceiveMessage = (message: Message) => {
            if (selectedContact && 
                ((message.sender === selectedContact.user._id && message.receiver === currentUser?.id) || 
                 (message.receiver === selectedContact.user._id && message.sender === currentUser?.id)) ) {
              setMessages(prevMessages => [...prevMessages, message]);
            } else {
              // If message is not for the currently selected chat, update contact list (e.g., unread count or last message)
              // And potentially show a small notification or update general notification count
              fetchContacts(); // Refresh contacts to show new last message
            }
          };
    
          socket.on('receiveMessage', handleReceiveMessage);
          // Consider adding listener for 'messageRead' if you implement that on backend
    
          return () => {
            socket.off('receiveMessage', handleReceiveMessage);
          };
        }
      }, [socket, selectedContact, currentUser]);
    
      useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, [messages]);
    
      const handleContactSelect = (contact: ChatContact) => {
        setSelectedContact(contact);
      };
    
      const handleSendMessage = (e: FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact || !currentUser || !socket) return;
    
        const messageData = {
          sender: currentUser.id, // Assuming currentUser from useAuth has the id
          receiverId: selectedContact.user._id,
          content: newMessage.trim(),
        };
    
        socket.emit('sendMessage', messageData);
        
        // Optimistic UI update (optional, but good for UX)
        const optimisticMessage: Message = {
            _id: new Date().toISOString(), // Temporary ID
            sender: currentUser.id,
            receiver: selectedContact.user._id,
            content: newMessage.trim(),
            read: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, optimisticMessage]);
        setNewMessage('');
        fetchContacts(); // Refresh contacts to update last message and order
      };
    
      if (!currentUser) return <p>Cargando...</p>;
     */
  const [messages, setMessages] = useState([
    { id: 1, user: "Ana", text: "Hola!" },
    { id: 2, user: "Vos", text: "¡Hola Ana! ¿Todo bien?" }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim() === "") return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), user: "Vos", text: newMessage }
    ]);
    setNewMessage("");
  };

  

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md mx-auto border rounded-2xl shadow p-4 bg-white">
      {/* Chat Header */}
      <div className="text-lg font-semibold mb-2 text-center border-b pb-2">
        Sala de Chat
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[70%] px-4 py-2 rounded-xl text-sm ${
              msg.user === "Vos"
                ? "ml-auto bg-blue-100 text-right"
                : "bg-gray-100 text-left"
            }`}
          >
            <div className="font-medium">{msg.user}</div>
            <div>{msg.text}</div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Escribí un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

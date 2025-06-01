import React, { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";

export default function ChatBox({ client, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const boxRef = useRef();

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setInput("");
    }
  };

  useEffect(() => {
    boxRef.current?.scrollTo(0, boxRef.current.scrollHeight);
  }, [messages]);

  return (
    <div className="w-64 h-80 bg-white rounded-lg shadow-lg flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={client.avatar} className="w-6 h-6 rounded-full" />
          <span className="font-medium">{client.name}</span>
        </div>
        <button onClick={onClose}>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={boxRef}
        className="flex-1 overflow-y-auto px-3 py-2 space-y-2 bg-gray-50"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className="bg-white p-2 rounded shadow text-sm">
            <p>{msg.text}</p>
            <p className="text-xs text-right text-gray-400">{msg.time}</p>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t p-2 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 text-sm px-2 py-1 border rounded focus:outline-none"
          placeholder="Escribe algo..."
        />
        <button onClick={sendMessage} className="text-blue-600 hover:text-blue-800">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import ChatBox from "./ChatBox";

const CLIENTS = [
  { id: 1, name: "Ana", avatar: "https://i.pravatar.cc/40?img=1" },
  { id: 2, name: "Luis", avatar: "https://i.pravatar.cc/40?img=2" },
  { id: 3, name: "Carlos", avatar: "https://i.pravatar.cc/40?img=3" },
];

export default function BottomBar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [openChats, setOpenChats] = useState([]);

  const openChatWith = (client) => {
    if (!openChats.find((c) => c.id === client.id)) {
      setOpenChats([...openChats, client]);
    }
    setShowDropdown(false);
  };

  const closeChat = (id) => {
    setOpenChats(openChats.filter((c) => c.id !== id));
  };

  return (
    <>
      {/* Floating ChatBoxes */}
      <div className="fixed bottom-16 right-4 flex gap-3">
        {openChats.map((client) => (
          <ChatBox key={client.id} client={client} onClose={() => closeChat(client.id)} />
        ))}
      </div>

      {/* Fixed Client Bar */}
      <div className="fixed bottom-0 w-full bg-white border-t shadow-md px-4 py-2 flex justify-end items-center">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Clientes conectados
          </button>
          {showDropdown && (
            <ul className="absolute bottom-12 right-0 bg-white border rounded shadow w-48">
              {CLIENTS.map((client) => (
                <li
                  key={client.id}
                  onClick={() => openChatWith(client)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <img src={client.avatar} alt="" className="w-6 h-6 rounded-full" />
                  <span>{client.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

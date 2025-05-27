import io, { Socket } from 'socket.io-client';

const SOCKET_URL = /* process.env.REACT_APP_SOCKET_URL || */ 'http://localhost:4000'; // Ensure your backend port matches

let socket/* : Socket */;

export const getSocket = ()/* : Socket */ => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initializeSocket first.");
  }
  return socket;
};

export const initializeSocket = (token/* ?: string */)/* : Socket */ => {
  // Disconnect existing socket if any before creating a new one
  if (socket && socket.connected) {
    socket.disconnect();
  }

  const options/* : Partial<any> */ = {
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
    transports: ['websocket'], // Prefer WebSocket
  };

  if (token) {
    options.auth = { token };
  }

  socket = io(SOCKET_URL, options);

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('disconnect', (reason/* : string */) => {
    console.log('Socket disconnected:', reason);
    // Handle disconnection logic, e.g., notify user, attempt manual reconnect if needed
  });

  socket.on('connect_error', (error/* : Error */) => {
    console.error('Socket connection error:', error);
    // Handle connection errors, e.g., fallback or notify user
  });

  // Add any global listeners here if needed, e.g.:
  // socket.on('some_global_event', (data) => { ... });

  return socket;
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
    console.log('Socket disconnected manually');
  }
}; 
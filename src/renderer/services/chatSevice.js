import api from './api'; // Importar la instancia de Axios configurada
/* import xhrAdapter from 'axios/lib/adapters/xhr';
 */


// Servicios de API
const chatService = {
  
  createRoom: async (roomData) => {
    const response = await api.post('/rooms/create', roomData);
    return response.data;
  },
  getRooms: async () => {
    const response = await api.get('/rooms');
    return response.data;
  },
  updateRoom: async (roomId, dataToUpdate) => {
    const response = await api.put(`/rooms/${roomId}`, dataToUpdate);
    return response.data;
  },
  deleteRoom: async (roomId) => {
    const response = await api.delete(`/rooms/${roomId}`);
    return response.data;
  },
  joinRoom: async (roomId, userId) => {
    const response = await api.post(`/rooms/join/${roomId}`, { user_id: userId });
    return response.data;
  },
  // Clientes
  getRoom: async (roomId/* : string */) => {
    try {
      const response = await api.get(`/rooms/${roomId}`);
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Error al obtener la sala:', error);
      throw error;
    }
  },
  

};

export default chatService; 
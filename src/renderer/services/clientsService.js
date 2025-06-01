import api from './api'; // Importar la instancia de Axios configurada
/* import xhrAdapter from 'axios/lib/adapters/xhr';
 */


// Servicios de API
const clientsService = {
  
  createClient: async (clientData) => {
    const response = await api.post('/clientes/create', clientData);
    return response.data;
  },
  updateClient: async (clientId, dataToUpdate) => {
    const response = await api.put(`/clientes/${clientId}`, dataToUpdate);
    return response.data;
  },
  deleteClient: async (idToDelete) => {
    // La API usa POST para eliminar, podría ser DELETE /clientes/${idToDelete}
    const response = await api.post(`/clientes/delete/${idToDelete}`);
    return response.data;
  },
  // Clientes
  getCliente: async (clienteId/* : string */) => {
    const response = await api.get(`/clientes/${clienteId}`);
    return response.data;
  },
  
  getResumenCliente: async (clienteId/* : string */) => {
    const response = await api.get/* <ResumenCliente> */(`/clientes/${clienteId}/resumen`);
    return response.data;
  },
  
  // Préstamos
  createPrestamo: async (prestamoData) => {
    const response = await api.post('/prestamos', prestamoData);
    return response.data;
  },
  updatePrestamo: async (prestamoId, prestamoData) => {
    const response = await api.put(`/prestamos/${prestamoId}`, prestamoData);
    return response.data;
  },
  deletePrestamo: async (prestamoId) => {
    const response = await api.delete(`/prestamos/${prestamoId}`);
    return response.data;
  },
  getPrestamosCliente: async (clienteId/* : string */) => {
    const response = await api.get/* <Prestamo[]> */(`/clientes/${clienteId}/prestamos`);
    return response.data;
  },
  
  getDetallePrestamo: async (prestamoId/* : string */) => {
    const response = await api.get/* <DetallePrestamo> */(`/prestamos/${prestamoId}/detalle`);
    return response.data;
  },
  
  // Pagos
  createPago: async (pagoData) => {
    const response = await api.post('/pagos', pagoData);
    return response.data;
  },
  updatePago: async (pagoId, pagoData) => {
    const response = await api.put(`/pagos/${pagoId}`, pagoData);
    return response.data;
  },
  deletePago: async (pagoId) => {
    const response = await api.delete(`/pagos/${pagoId}`);
    return response.data;
  },
  getPagosCliente: async (clienteId/* : string */) => {
    const response = await api.get/* <Pago[]> */(`/clientes/${clienteId}/pagos`);
    return response.data;
  },
  
  getHistorialPagos: async (clienteId/* : string */, page = 1, limit = 10) => {
    const response = await api.get/* <PagosHistorialResponse> */(
      `/pagos/cliente/${clienteId}/historial?page=${page}&limit=${limit}`
    );
    return response.data;
  },
  
  getPagosPendientes: async (clienteId/* : string */) => {
    const response = await api.get/* <PagosPendientesResponse> */(`/pagos/cliente/${clienteId}/pendientes`);
    return response.data;
  },
  
  

  // Chat
  getChatHistory: async (otherClientId/* : string */) => {
    const response = await api.get/* <Message[]> */(`/chat/history/${otherClientId}`); 
    return response.data;
  },

  getChatContacts: async () => {
    // Define a type for chat contacts if needed, e.g., ChatContact[]
    // For now, using any as a placeholder, should be replaced with a proper type
    const response = await api.get/* <any[]> */(`/chat/contacts`); 
    return response.data;
  }
};

export default clientsService; 
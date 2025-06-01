import api from './api'; // Importar la instancia de Axios configurada

// Las definiciones de tipos (interfaces) como Pago, PagosHistorialResponse, etc., 
// idealmente deberían estar en un archivo de tipos compartido e importarse aquí si es necesario.
/*
export interface Pago { ... }
export interface PagosHistorialResponse { ... }
export interface PagosPendientesResponse { ... }
*/

const paymentsService = {
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

  getPagosCliente: async (clienteId) => {
    const response = await api.get(`/clientes/${clienteId}/pagos`);
    return response.data;
  },
  
  getHistorialPagos: async (clienteId, page = 1, limit = 10) => {
    const response = await api.get(
      `/pagos/cliente/${clienteId}/historial?page=${page}&limit=${limit}`
    );
    return response.data;
  },
  
  getPagosPendientes: async (clienteId) => {
    const response = await api.get(`/pagos/cliente/${clienteId}/pendientes`);
    return response.data;
  },

  // Si hay otras funciones específicas para pagos que estaban en clientsService o api.js, agrégalas aquí.
  // Por ejemplo, si getFilteredUserPayments es relevante:
  getMyPayments: async (params) => { // params podría ser { page, limit, status, sortBy, sortOrder }
    const response = await api.get('/pagos/my-payments', { params });
    return response.data;
  }
};

export default paymentsService; 
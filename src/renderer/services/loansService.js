import api from './api'; // Importar la instancia de Axios configurada
/* import xhrAdapter from 'axios/lib/adapters/xhr';
 */

// Servicios de API
const loansService = {
  createPrestamo: async (data) => {
    const response = await api.post('/prestamos', data);
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

  getPrestamosCliente: async (clienteId) => {
    const response = await api.get(`/clientes/${clienteId}/prestamos`);
    return response.data;
  },
  
  getDetallePrestamo: async (prestamoId) => {
    const response = await api.get(`/prestamos/${prestamoId}/detalle`);
    return response.data;
  },
  
  // Si hay otras funciones específicas para préstamos que estaban en clientsService o api.js, agrégalas aquí.
  // Por ejemplo, si getLoansForFilter es relevante:
  getLoansForFilter: async () => {
    const response = await api.get('/prestamos/for-filter');
    return response.data;
  }
};

export default loansService; 
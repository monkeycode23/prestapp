import axios from 'axios';
// Ya no importamos authService aquí, cada servicio lo manejará o usará el token directamente.

/* import xhrAdapter from 'axios/lib/adapters/xhr'; // Comentado si no se usa */

// Las definiciones de tipos (interfaces) idealmente deberían estar en un archivo separado, 
// por ejemplo, 'types.ts' o 'interfaces.ts', y ser importadas donde se necesiten.
// Por ahora, las dejamos comentadas o asumimos que están definidas globalmente o no son estrictamente necesarias para esta refactorización de servicios.

/*
export interface Cliente { ... }
export interface Notification { ... }
export interface Prestamo { ... }
export interface Pago { ... }
export interface Message { ... }
export interface ResumenCliente { ... }
export interface DetallePrestamo { ... }
export interface PagosPendientesResponse { ... }
export interface PagosHistorialResponse { ... }
*/

const API_BASE_URL = 'http://localhost:4000/api';
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api'; // Opción con variable de entorno

const api = axios.create({
  baseURL: API_BASE_URL,
  // adapter: xhrAdapter, // Comentado si no se usa
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    // console.log('Token desde api.js:', token); // Para depuración
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // console.error('Error en interceptor de request:', error); // Para depuración
    return Promise.reject(error);
  }
);

// Ya no exportamos un objeto apiService con todos los métodos, solo la instancia de axios.
export default api; 
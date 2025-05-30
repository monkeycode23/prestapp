


export default {
    // Autenticación
  login: async (username,password/* : string */) => {
    const response = await api.post('/auth/login', { username,password });
    return response.data;
  },
  register: async (username,password,email) => {
    const response = await api.post('/auth/register', { username,password,email });
    return response.data;
  },
  verifyToken: async () => {
    const response = await api.get('/auth/verificar');
    return response.data;
  },
}

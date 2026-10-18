import api from './api.js';
const authService = {
  login: (credentials) => api('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (details) => api('/auth/register', { method: 'POST', body: JSON.stringify(details) }),
};
export default authService;

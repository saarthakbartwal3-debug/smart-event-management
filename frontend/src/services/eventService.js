import api from './api.js';
const eventService = {
  getAll: (search = '') => api(`/events${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getById: (id) => api(`/events/${id}`),
  create: (event) => api('/events', { method: 'POST', body: JSON.stringify(event) }),
  update: (id, event) => api(`/events/${id}`, { method: 'PUT', body: JSON.stringify(event) }),
  remove: (id) => api(`/events/${id}`, { method: 'DELETE' }),
};
export default eventService;

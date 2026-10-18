import api from './api.js';
const venueService = {
  getAll: () => api('/venues'),
  getById: (id) => api(`/venues/${id}`),
  create: (venue) => api('/venues', { method: 'POST', body: JSON.stringify(venue) }),
  update: (id, venue) => api(`/venues/${id}`, { method: 'PUT', body: JSON.stringify(venue) }),
  remove: (id) => api(`/venues/${id}`, { method: 'DELETE' }),
};
export default venueService;

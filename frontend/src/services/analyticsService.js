import api from './api.js';
const analyticsService = {
  getSummary: () => api('/admin/analytics'),
  getCrowd: (eventId) => api(`/admin/analytics/crowd${eventId ? `?eventId=${eventId}` : ''}`),
};
export default analyticsService;

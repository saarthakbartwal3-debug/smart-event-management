import api from './api.js';

const analyticsService = {
  getSummary: () => api('/analytics/dashboard'),

  getCrowd: async (eventId) => {
    const dashboard = await api('/analytics/dashboard');

    const events = dashboard?.events || [];

    return eventId
      ? events.filter((event) => event.eventId === Number(eventId))
      : events;
  },
};

export default analyticsService;
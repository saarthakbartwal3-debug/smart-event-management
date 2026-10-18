import api from './api.js';

const bookingService = {
  getMine: () => api('/bookings/mine'),

  create: (eventId) =>
    api(`/bookings/event/${eventId}`, {
      method: 'POST',
    }),

  cancel: (id) =>
    api(`/bookings/${id}`, {
      method: 'DELETE',
    }),
};

export default bookingService;

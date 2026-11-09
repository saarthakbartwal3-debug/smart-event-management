
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

  getQr: async (id) => {
    const token = localStorage.getItem('sem_token');

    const response = await fetch(
      `http://localhost:8080/api/bookings/${id}/qr`,
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {},
      }
    );

    if (!response.ok) {
      throw new Error(`Could not load QR ticket (${response.status})`);
    }

    return URL.createObjectURL(await response.blob());
  },
};

export default bookingService;

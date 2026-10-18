import api from './api.js';
const attendanceService = {
  getAll: () => api('/attendance'),
  checkIn: (bookingId) => api('/attendance/check-in', { method: 'POST', body: JSON.stringify({ bookingId }) }),
};
export default attendanceService;

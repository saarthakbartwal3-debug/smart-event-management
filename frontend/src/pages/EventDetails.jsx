
import { useEffect, useState } from 'react';
import eventService from '../services/eventService.js';
import bookingService from '../services/bookingService.js';
import { useAuthContext } from '../context/AuthContext.jsx';
import { formatDate, formatPrice } from '../utils/formatDate.js';

export default function EventDetails() {
  const id = window.location.pathname.split('/').filter(Boolean).pop();
  const { user, isAuthenticated } = useAuthContext();

  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    eventService
      .getById(id)
      .then(setEvent)
      .catch((e) => setError(e.message || 'Unable to load event.'));
  }, [id]);

  const handleRegister = async () => {
    setError('');
    setMessage('');
    setBooking(true);

    try {
      await bookingService.create(id);
      setMessage('Registration successful! Check My Registrations for your booking.');
    } catch (e) {
      setError(e.message || 'Registration failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (error && !event) {
    return (
      <main className="page-shell">
        <p className="error-message">{error}</p>
        <a href="/events">Back to events</a>
      </main>
    );
  }

  if (!event) {
    return <main className="page-shell">Loading event details...</main>;
  }

  return (
    <main className="page-shell">
      <a href="/events">← Back to events</a>

      <div className="page-heading">
        <p className="eyebrow">EVENT DETAILS</p>
        <h1>{event.name}</h1>
        <p>{event.description || 'Join us for this event.'}</p>
      </div>

      <div className="event-card">
        <p>📅 {formatDate(event.eventDate)}</p>
        <p>📍 {event.venue || event.venueEntity?.name || 'Venue to be announced'}</p>
        <p>{formatPrice(event.ticketPrice)}</p>
        <p>Capacity: {event.capacity ?? 'Not specified'}</p>

        {message && <p>{message}</p>}
        {error && <p className="error-message">{error}</p>}

        {!isAuthenticated ? (
          <a className="primary-link" href="/login">
            Log in to register
          </a>
        ) : user?.role === 'ADMIN' ? (
          <p>Admin accounts cannot register as students.</p>
        ) : (
          <button onClick={handleRegister} disabled={booking}>
            {booking ? 'Registering...' : 'Register for event'}
          </button>
        )}
      </div>
    </main>
  );
}

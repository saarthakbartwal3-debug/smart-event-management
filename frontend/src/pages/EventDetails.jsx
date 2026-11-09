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
      <main className="page-shell event-details-page">
        <p className="error-message">{error}</p>
        <a href="/events">Back to events</a>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="page-shell event-details-page">
        <p className="details-loading">Loading event details...</p>
      </main>
    );
  }

  return (
    <main className="page-shell event-details-page">

      <a className="back-events-link" href="/events">
        ← Back to events
      </a>

      <div className="details-heading">
        <p className="details-eyebrow">EVENT DETAILS</p>

        <h1>{event.name}</h1>

        <p className="details-description">
          {event.description || 'Join us for this event.'}
        </p>
      </div>

      <section className="event-details-card">

        <div className="details-information">
          <p>
            <span>📅</span>
            {formatDate(event.eventDate)}
          </p>

          <p>
            <span>📍</span>
            {event.venue || event.venueEntity?.name || 'Venue to be announced'}
          </p>

          <p>
            <span>🎟️</span>
            {formatPrice(event.ticketPrice)}
          </p>

          <p>
            <span>👥</span>
            Capacity: {event.capacity ?? 'Not specified'}
          </p>
        </div>

        {message && (
          <div className="details-success">{message}</div>
        )}

        {error && (
          <div className="details-error">{error}</div>
        )}

        <div className="details-actions">
          {!isAuthenticated ? (
            <a className="details-register-button" href="/login">
              Log in to register →
            </a>
          ) : user?.role === 'ADMIN' ? (
            <p className="admin-notice">
              Admin accounts cannot register as students.
            </p>
          ) : (
            <button
              className="details-register-button"
              onClick={handleRegister}
              disabled={booking}
            >
              {booking ? 'Registering...' : 'Register for event →'}
            </button>
          )}
        </div>

      </section>
    </main>
  );
}
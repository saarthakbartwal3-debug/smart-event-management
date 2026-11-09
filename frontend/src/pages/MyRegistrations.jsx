
import { useEffect, useRef, useState } from 'react';
import bookingService from '../services/bookingService.js';
import { formatDate, formatPrice } from '../utils/formatDate.js';

export default function MyRegistrations() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [registeringId, setRegisteringId] = useState(null);
  const [qrLoadingId, setQrLoadingId] = useState(null);
  const [qrTickets, setQrTickets] = useState({});
  const [message, setMessage] = useState('');

  const qrUrls = useRef(new Set());

  useEffect(() => {
    return () => {
      qrUrls.current.forEach((url) => URL.revokeObjectURL(url));
      qrUrls.current.clear();
    };
  }, []);

  async function loadRegistrations() {
    setLoading(true);
    setError('');

    try {
      const data = await bookingService.getMine();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Could not load registrations.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRegistrations();
  }, []);

  function getEventId(booking) {
    return booking.event?.id ?? booking.eventId;
  }

  function clearQr(bookingId) {
    setQrTickets((current) => {
      const url = current[bookingId];

      if (url) {
        URL.revokeObjectURL(url);
        qrUrls.current.delete(url);
      }

      const updated = { ...current };
      delete updated[bookingId];
      return updated;
    });
  }

  async function handleCancel(booking) {
    const eventName =
      booking.event?.name || booking.eventName || 'this event';

    if (
      !window.confirm(
        `Are you sure you want to cancel your registration for ${eventName}?`
      )
    ) {
      return;
    }

    setCancellingId(booking.id);
    setError('');
    setMessage('');

    try {
      await bookingService.cancel(booking.id);

      clearQr(booking.id);

      setItems((current) =>
        current.map((item) =>
          item.id === booking.id
            ? { ...item, status: 'CANCELLED' }
            : item
        )
      );

      setMessage('Registration cancelled successfully. You can register again if the event is available.');
    } catch (e) {
      setError(e.message || 'Could not cancel this registration.');
    } finally {
      setCancellingId(null);
    }
  }

  async function handleRegisterAgain(booking) {
    const eventId = getEventId(booking);

    if (eventId == null) {
      setError('Could not find the event ID. Please open the Events page to register again.');
      return;
    }

    if (!window.confirm('Would you like to register for this event again?')) {
      return;
    }

    setRegisteringId(booking.id);
    setError('');
    setMessage('');

    try {
      await bookingService.create(eventId);
      await loadRegistrations();

      setMessage(
        'Registration request submitted successfully. Check the updated booking status.'
      );
    } catch (e) {
      setError(
        e.message ||
          'Could not register again. The event may be full or unavailable.'
      );
    } finally {
      setRegisteringId(null);
    }
  }

  async function handleViewQr(booking) {
    setError('');
    setMessage('');

    if (qrTickets[booking.id]) {
      clearQr(booking.id);
      return;
    }

    if (typeof bookingService.getQr !== 'function') {
      setError(
        'QR ticket service is not configured yet. Add getQr() to bookingService.js.'
      );
      return;
    }

    setQrLoadingId(booking.id);

    try {
      const url = await bookingService.getQr(booking.id);

      qrUrls.current.add(url);

      setQrTickets((current) => ({
        ...current,
        [booking.id]: url,
      }));
    } catch (e) {
      setError(e.message || 'Could not load the QR ticket.');
    } finally {
      setQrLoadingId(null);
    }
  }

  return (
    <main className="page-shell">
      <p className="eyebrow">YOUR PLANS</p>
      <h1>My Registrations</h1>
      <p>Review and manage your event bookings.</p>

      {loading && <p>Loading registrations...</p>}

      {error && <p className="error-message">{error}</p>}

      {message && <p role="status">{message}</p>}

      {!loading && items.length === 0 && (
        <p>
          You have no registrations yet.{' '}
          <a href="/events">Explore events</a>.
        </p>
      )}

      <div className="event-grid">
        {items.map((booking) => {
          const status = String(
            booking.status || 'REGISTERED'
          ).toUpperCase();

          const canCancel = [
            'CONFIRMED',
            'WAITLISTED',
            'WAITING',
          ].includes(status);

          const canRegisterAgain = status === 'CANCELLED';
          const isConfirmed = status === 'CONFIRMED';

          return (
            <article className="event-card" key={booking.id}>
              <h3>
                {booking.event?.name ||
                  booking.eventName ||
                  `Booking #${booking.id}`}
              </h3>

              <p>
                {formatDate(
                  booking.event?.eventDate || booking.eventDate
                )}
              </p>

              <div className="event-meta">
                <span>Status: {status}</span>
                <strong>
                  {formatPrice(
                    booking.event?.ticketPrice ??
                      booking.ticketPrice
                  )}
                </strong>
              </div>

              {isConfirmed && (
                <section className="registration-actions">
                  <button
                    type="button"
                    className="qr-button"
                    disabled={qrLoadingId === booking.id}
                    onClick={() => handleViewQr(booking)}
                  >
                    {qrLoadingId === booking.id
                      ? 'Loading QR...'
                      : qrTickets[booking.id]
                        ? 'Hide QR Ticket'
                        : 'View QR Ticket'}
                  </button>

                  {qrTickets[booking.id] && (
                    <div className="qr-ticket">
                      <p>Show this ticket to the event organizer.</p>
                      <img
                        src={qrTickets[booking.id]}
                        alt={`QR ticket for ${
                          booking.event?.name ||
                          booking.eventName ||
                          'event'
                        }`}
                        width="240"
                        height="240"
                      />
                    </div>
                  )}
                </section>
              )}

              {canCancel && (
                <button
                  type="button"
                  className="cancel-button"
                  disabled={cancellingId === booking.id}
                  onClick={() => handleCancel(booking)}
                >
                  {cancellingId === booking.id
                    ? 'Cancelling...'
                    : 'Cancel Registration'}
                </button>
              )}

              {canRegisterAgain && (
                <button
                  type="button"
                  className="register-again-button"
                  disabled={registeringId === booking.id}
                  onClick={() => handleRegisterAgain(booking)}
                >
                  {registeringId === booking.id
                    ? 'Registering...'
                    : 'Register Again'}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </main>
  );
}

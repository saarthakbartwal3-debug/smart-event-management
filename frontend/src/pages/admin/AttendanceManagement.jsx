import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../../services/api.js';

export default function AttendanceManagement() {
  const [ticketCode, setTicketCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText) => {
        scanner.clear().catch(() => {});
        setTicketCode(decodedText);
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  const checkIn = async (e) => {
    e.preventDefault();
    if (!ticketCode.trim()) return;

    setLoading(true);
    setMessage('');
    setError('');

    try {
      await api('/attendance/check-in', {
        method: 'POST',
        body: JSON.stringify({ ticketCode: ticketCode.trim() }),
      });

      setMessage('Attendance marked successfully!');
      setTicketCode('');
    } catch (err) {
      setError(err.message || 'Check-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <p className="eyebrow">ADMINISTRATION</p>
      <h1>Attendance Management</h1>
      <p>Scan a ticket QR code or enter its ticket code manually.</p>

      <section className="event-card">
        <h2>Scan QR Code</h2>
        <div id="qr-reader" style={{ maxWidth: '500px' }} />
      </section>

      <section className="event-card">
        <h2>Verify Ticket</h2>

        <form onSubmit={checkIn}>
          <input
            type="text"
            value={ticketCode}
            onChange={(e) => setTicketCode(e.target.value)}
            placeholder="Enter ticket code"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Check In'}
          </button>
        </form>

        {message && <p>{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </section>
    </main>
  );
}
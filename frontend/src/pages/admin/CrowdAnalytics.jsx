import { useEffect, useState } from 'react';
import analyticsService from '../../services/analyticsService.js';

export default function CrowdAnalytics() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getSummary()
      .then(setData)
      .catch((e) => setError(e.message || 'Unable to load analytics.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <main className="page-shell"><p>Loading analytics...</p></main>;
  }

  if (error) {
    return <main className="page-shell"><p className="error-message">{error}</p></main>;
  }

  if (!data) {
    return <main className="page-shell"><p>No analytics available.</p></main>;
  }

  return (
    <main className="page-shell">
      <p className="eyebrow">ADMINISTRATION</p>
      <h1>Crowd Analytics</h1>
      <p>Live event registration and attendance overview.</p>

      <section className="event-grid">
        <article className="event-card">
          <h3>Total Events</h3>
          <h2>{data.totalEvents ?? 0}</h2>
        </article>

        <article className="event-card">
          <h3>Confirmed Registrations</h3>
          <h2>{data.confirmedRegistrations ?? 0}</h2>
        </article>

        <article className="event-card">
          <h3>Total Attended</h3>
          <h2>{data.totalAttended ?? 0}</h2>
        </article>

        <article className="event-card">
          <h3>Overall Attendance</h3>
          <h2>{data.overallAttendancePercentage ?? 0}%</h2>
        </article>
      </section>

      <h2>Event-wise Analytics</h2>

      <section className="event-grid">
        {(data.events || []).map((event) => (
          <article className="event-card" key={event.eventId}>
            <h3>{event.eventName}</h3>
            <p>Capacity: {event.capacity}</p>
            <p>Registrations: {event.registrations}</p>
            <p>Attended: {event.attended}</p>
            <p>Occupancy: {event.occupancyPercentage}%</p>
            <p>Attendance: {event.attendancePercentage}%</p>
          </article>
        ))}
      </section>
    </main>
  );
}
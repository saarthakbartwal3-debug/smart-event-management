import { useState } from 'react';
import useEvents from '../hooks/useEvents.js';
import EventCard from '../components/EventCard.jsx';

export default function Events() {
  const [query, setQuery] = useState('');
  const { events, loading, error } = useEvents(query);

  return (
    <main className="page-shell events-page">
      <div className="page-heading">
        <p className="eyebrow">DISCOVER SOMETHING NEW</p>
        <h1>Explore <span>events.</span></h1>
        <p>
          Find your next campus event, workshop, festival, or meetup.
          Discover experiences worth remembering.
        </p>
      </div>

      <div className="events-search-wrapper">
        <span className="search-icon">⌕</span>
        <input
          className="search-field"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search events by name or category..."
          aria-label="Search events"
        />
      </div>

      {loading && (
        <p className="events-status">Loading events...</p>
      )}

      {error && (
        <p className="error-message">{error}</p>
      )}

      {!loading && !error && events.length === 0 && (
        <div className="events-empty">
          <div>✦</div>
          <h3>No events found</h3>
          <p>Try another search or check back soon for upcoming events.</p>
        </div>
      )}

      {!loading && !error && events.length > 0 && (
        <>
          <div className="events-results-heading">
            <h2>Available events</h2>
            <span>{events.length} events found</span>
          </div>

          <div className="event-grid">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
import { useState } from 'react';
import useEvents from '../hooks/useEvents.js';
import EventCard from '../components/EventCard.jsx';
export default function Events() {
  const [query, setQuery] = useState('');
  const { events, loading, error } = useEvents(query);
  return <main className="page-shell"><div className="page-heading"><p className="eyebrow">DISCOVER SOMETHING NEW</p><h1>Explore events</h1><p>Find your next campus event, workshop, festival, or meetup.</p></div>
    <input className="search-field" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search events..." aria-label="Search events"/>
    {loading && <p>Loading events…</p>}{error && <p className="error-message">{error}</p>}
    {!loading && !error && events.length === 0 && <p>No events found yet. Check back soon.</p>}
    <div className="event-grid">{events.map(event => <EventCard key={event.id} event={event}/>)}</div>
  </main>;
}

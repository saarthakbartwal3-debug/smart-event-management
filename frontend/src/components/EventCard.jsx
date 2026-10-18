import './EventCard.css';
import { formatDate, formatPrice } from '../utils/formatDate.js';
export default function EventCard({ event, onBook }) {
  return <article className="event-card"><div className="event-meta"><span>✦ Featured event</span><strong>{formatPrice(event.ticketPrice)}</strong></div>
    <h3>{event.name}</h3><p>{event.description || 'Join us for this event. View details for more information.'}</p>
    <div className="event-meta"><span>📅 {formatDate(event.eventDate)}</span><span>📍 {event.venue || event.venueEntity?.name || 'Venue to be announced'}</span></div>
    {onBook ? <button onClick={() => onBook(event)}>Register / Book</button> : <a href={`/events/${event.id}`}>View details →</a>}
  </article>;
}

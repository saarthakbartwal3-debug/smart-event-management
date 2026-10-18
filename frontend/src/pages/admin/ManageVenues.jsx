import { useEffect, useState } from 'react';
import api from '../../services/api.js';

const emptyForm = {
  name: '',
  location: '',
  capacity: '',
  description: '',
};

export default function ManageVenues() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function loadVenues() {
    try {
      const data = await api('/venues');
      setItems(Array.isArray(data) ? data : []);
      setError('');
    } catch (e) {
      setError(e.message || 'Could not load venues.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVenues();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(previous => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    try {
      await api('/venues', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name.trim(),
          location: form.location.trim(),
          capacity: Number(form.capacity),
          description: form.description.trim(),
        }),
      });

      setForm(emptyForm);
      setMessage('Venue added successfully!');
      await loadVenues();
    } catch (e) {
      setError(e.message || 'Could not save the venue.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page-shell">
      <p className="eyebrow">ADMINISTRATION</p>
      <h1>Manage venues</h1>
      <p>Create and maintain event venues.</p>

      <section className="event-card">
        <h2>Add a venue</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="venue-name">Venue name</label>
          <input
            id="venue-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Main Auditorium"
            required
          />

          <label htmlFor="venue-location">Location</label>
          <input
            id="venue-location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Dehradun"
            required
          />

          <label htmlFor="venue-capacity">Capacity</label>
          <input
            id="venue-capacity"
            name="capacity"
            type="number"
            min="1"
            value={form.capacity}
            onChange={handleChange}
            placeholder="e.g. 500"
            required
          />

          <label htmlFor="venue-description">Description</label>
          <textarea
            id="venue-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the venue"
            rows="3"
          />

          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Add venue'}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}
        {message && <p role="status">{message}</p>}
      </section>

      <section>
        <h2>Existing venues</h2>

        {loading && <p>Loading venues...</p>}
        {!loading && !error && items.length === 0 && (
          <p>No venues available yet. Add your first venue above.</p>
        )}

        <div className="event-grid">
          {items.map(venue => (
            <article className="event-card" key={venue.id}>
              <h3>{venue.name}</h3>
              <p>{venue.location}</p>
              <p>Capacity: {venue.capacity}</p>
              {venue.description && <p>{venue.description}</p>}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

import { useCallback, useEffect, useState } from 'react';
import eventService from '../services/eventService.js';
export default function useEvents(search = '') {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => {
    setLoading(true); setError('');
    try { const data = await eventService.getAll(search); setEvents(Array.isArray(data) ? data : []); }
    catch (e) { setError(e.message || 'Could not load events. Check that the backend is running.'); }
    finally { setLoading(false); }
  }, [search]);
  useEffect(() => { refresh(); }, [refresh]);
  return { events, loading, error, refresh };
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('sem_token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!response.ok) throw new Error(data?.message || data?.error || `Request failed (${response.status})`);
  return data;
}
export default apiRequest;

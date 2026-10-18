import { useEffect, useState } from 'react';
import api from '../../services/api.js';
export default function ManageBookings() {
 const [items,setItems]=useState([]); const [error,setError]=useState(''); const [loading,setLoading]=useState(true);
 useEffect(()=>{api('/admin/bookings').then(d=>setItems(Array.isArray(d)?d:(d?[d]:[]))).catch(e=>setError(e.message||'This backend endpoint is not available yet.')).finally(()=>setLoading(false));},[]);
 return <main className="page-shell"><p className="eyebrow">ADMINISTRATION</p><h1>Manage bookings</h1><p>Review event registrations.</p>{loading&&<p>Loading…</p>}{error&&<p className="error-message">{error}</p>}{!loading&&!error&&!items.length&&<p>No data available.</p>}<div className="event-grid">{items.map((item,i)=><article className="event-card" key={item.id??i}><h3>{item.name||item.eventName||item.email||item.title||`Record ${item.id??i+1}`}</h3><p>{item.status||item.role||item.description||JSON.stringify(item)}</p></article>)}</div></main>;
}

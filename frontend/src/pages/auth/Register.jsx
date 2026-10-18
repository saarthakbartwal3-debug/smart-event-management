import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
export default function Register() {
 const { register, loading }=useAuth(); const [form,setForm]=useState({name:'',email:'',password:''});const [error,setError]=useState('');const [success,setSuccess]=useState(false);
 const change=e=>setForm({...form,[e.target.name]:e.target.value});
 async function submit(e){e.preventDefault();setError('');try{await register(form);setSuccess(true);}catch(err){setError(err.message||'Could not create account.');}}
 return <main className="form-page"><form className="form-card" onSubmit={submit}><p className="eyebrow">JOIN THE COMMUNITY</p><h1>Create account</h1><p>Register to keep your event bookings together.</p>{error&&<p className="error-message">{error}</p>}{success&&<p className="success-message">Account created successfully. <a href="/">Go home</a></p>}<label>Full name<input name="name" value={form.name} onChange={change} required maxLength="100" autoComplete="name"/></label><label>Email address<input type="email" name="email" value={form.email} onChange={change} required autoComplete="email"/></label><label>Password<input type="password" name="password" value={form.password} onChange={change} required minLength="8" autoComplete="new-password"/><small>Use at least 8 characters.</small></label><button disabled={loading}>{loading?'Creating account…':'Create account'}</button><p>Already registered? <a href="/login">Log in</a></p></form></main>;
}

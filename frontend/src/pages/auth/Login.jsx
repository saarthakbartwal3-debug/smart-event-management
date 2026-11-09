import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';

export default function Login() {
  const { login, loading } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function submit(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await login(form);
      setMessage('Login successful. You can return to the home page.');
    } catch (err) {
      setError(err.message || 'Login failed. Check your details.');
    }
  }

  return (
    <main className="form-page login-page">
      <form className="form-card login-card" onSubmit={submit}>

        <p className="eyebrow">WELCOME BACK</p>

        <h1>Log in</h1>

        <p className="login-subtitle">
          Sign in to manage your event plans.
        </p>

        {error && (
          <p className="error-message">{error}</p>
        )}

        {message && (
          <p className="success-message">
            {message} <a href="/">Go home</a>
          </p>
        )}

        <label>
          Email address
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={change}
            placeholder="Enter your email address"
            required
            autoComplete="email"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={change}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
          />
        </label>

        <button className="login-button" disabled={loading}>
          {loading ? 'Signing in...' : 'Log in'}
        </button>

        <p className="login-footer">
          New here? <a href="/register">Create an account</a>
        </p>

      </form>
    </main>
  );
}

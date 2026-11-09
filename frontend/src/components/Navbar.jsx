import { useAuth } from '../hooks/useAuth.js';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const currentPath = window.location.pathname;

  const isActive = (path) => location.pathname === path;

  return (
    <header className="site-navbar">
      <a className="site-brand" href="/">
        <span className="brand-symbol">✦</span>
        <span>EventEase</span>
      </a>

      <nav className="main-navigation">
        <a className={isActive('/') ? 'active' : ''} href="/">
          Home
        </a>

        <a href="/#events">Events</a>

        <a className={isActive('/venues') ? 'active' : ''} href="/venues">
          Venues
        </a>

        {user && (
          <>
            <a
              className={isActive('/registrations') ? 'active' : ''}
              href="/registrations"
            >
              My Registrations
            </a>

            {isAdmin && (
              <a
                className={location.pathname.startsWith('/admin') ? 'active' : ''}
                href="/admin"
              >
                Admin Panel
              </a>
            )}
          </>
        )}
      </nav>

      <div className="nav-account">
        {user ? (
          <>
            <div className="nav-user">
              <span className="user-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </span>

              <div className="user-details">
                <strong>{user.name}</strong>
                <small>{isAdmin ? 'Administrator' : 'Student'}</small>
              </div>
            </div>

            <button className="logout-button" onClick={logout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <a className="login-link" href="/login">
              Log in
            </a>

            <a className="nav-cta" href="/register">
              Get Started →
            </a>
          </>
        )}
      </div>
    </header>
  );
}
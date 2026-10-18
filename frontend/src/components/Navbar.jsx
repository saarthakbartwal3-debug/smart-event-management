import { useAuth } from '../hooks/useAuth.js';
import './Navbar.css';
export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  return <header className="site-navbar"><a className="site-brand" href="/">✦ EventEase</a><nav>
    <a href="/">Home</a><a href="/#events">Events</a><a href="/venues">Venues</a>
    {user && <><a href="/registrations">My registrations</a>{isAdmin && <a href="/admin">Admin</a>}</>}
  </nav><div className="nav-account">{user ? <><span>{user.name}</span><button onClick={logout}>Log out</button></> : <><a href="/login">Log in</a><a className="nav-cta" href="/register">Create account</a></>}</div></header>;
}

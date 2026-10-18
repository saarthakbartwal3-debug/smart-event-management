import Events from './Events.jsx';
export default function Home() {
 return <><section className="home-hero"><div><p className="eyebrow">YOUR NEXT GREAT EXPERIENCE STARTS HERE</p><h1>Make moments.<br/><span>Build memories.</span></h1><p>Discover events, connect with your community, and keep all your event plans in one place.</p><a className="primary-link" href="#events">Explore events ↓</a></div><div className="hero-orb" aria-hidden="true">✦</div></section><div id="events"><Events/></div></>;
}

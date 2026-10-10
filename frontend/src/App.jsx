import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:8080/api/events')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load events')
        }
        return response.json()
      })
      .then((data) => {
        setEvents(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Could not connect to the backend. Please check Spring Boot.')
        setLoading(false)
      })
  }, [])

  return (
    <div className="app">
      <nav className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">✦</span>
          Event<span>Ease</span>
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#events">Explore Events</a>
          <a href="#about">About</a>
        </div>

        <a className="nav-button" href="#events">
          Discover Events ↗
        </a>
      </nav>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="live-dot"></span>
              YOUR NEXT GREAT EXPERIENCE STARTS HERE
            </div>

            <h1>
              Moments that
              <br />
              become <span>memories.</span>
            </h1>

            <p className="hero-description">
              Discover amazing events, find your people, and make every
              moment count. Your next unforgettable experience is just a
              click away.
            </p>

            <div className="hero-actions">
              <a href="#events" className="primary-button">
                Explore Events <span>→</span>
              </a>
              <a href="#about" className="secondary-button">
                Learn More
              </a>
            </div>

            <div className="hero-stats">
              <div>
                <strong>{events.length}+</strong>
                <span>Events listed</span>
              </div>
              <div className="stat-divider"></div>
              <div>
                <strong>Easy</strong>
                <span>Event discovery</span>
              </div>
              <div className="stat-divider"></div>
              <div>
                <strong>One</strong>
                <span>Connected platform</span>
              </div>
            </div>
          </div>

          <div className="hero-art">
            <div className="art-glow"></div>

            <div className="floating-card card-top">
              <span>✦</span>
              <div>
                <strong>Good vibes only</strong>
                <small>Make it a moment</small>
              </div>
            </div>

            <div className="event-illustration">
              <div className="illustration-sun"></div>
              <div className="illustration-orbit orbit-one"></div>
              <div className="illustration-orbit orbit-two"></div>

              <div className="illustration-center">
                <span className="big-star">✦</span>
                <span className="small-star star-one">✧</span>
                <span className="small-star star-two">✦</span>
                <span className="small-star star-three">✧</span>
                <div className="illustration-label">LET'S CELEBRATE</div>
              </div>

              <div className="illustration-bottom">
                <span>CREATE</span>
                <span>CONNECT</span>
                <span>CELEBRATE</span>
              </div>
            </div>

            <div className="floating-card card-bottom">
              <span className="ticket-icon">▤</span>
              <div>
                <strong>Your plans, sorted.</strong>
                <small>Find something exciting</small>
              </div>
            </div>
          </div>
        </section>

        <section className="events-section" id="events">
          <div className="section-heading">
            <div>
              <span className="section-tag">FIND YOUR NEXT ADVENTURE</span>
              <h2>Events worth <span>showing up for.</span></h2>
              <p>Explore the events available on our platform.</p>
            </div>

            <div className="event-count">
              {events.length} {events.length === 1 ? 'event' : 'events'}
            </div>
          </div>

          {loading && <p className="message">Loading events...</p>}

          {error && <p className="message error-message">{error}</p>}

          {!loading && !error && events.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">✧</div>
              <h3>Your next favourite event starts here.</h3>
              <p>
                There are no events listed yet. Add an event through the
                backend API, and it will appear here automatically.
              </p>
            </div>
          )}

          {!loading && !error && events.length > 0 && (
            <div className="event-grid">
              {events.map((event) => (
                <article className="event-card" key={event.id}>
                  <div className="event-card-art">
                    <span className="event-art-star">✦</span>
                    <span className="event-art-id">
                      EVENT #{String(event.id).padStart(3, '0')}
                    </span>
                    <span className="event-art-decoration">✧</span>
                  </div>

                  <div className="event-card-content">
                    <span className="event-category">FEATURED EVENT</span>
                    <h3>{event.name}</h3>

                    <p className="event-description">
                      {event.description || 'Come along and be part of this experience.'}
                    </p>

                    <div className="event-detail">
                      <span>◷</span>
                      {event.eventDate
                        ? new Date(event.eventDate).toLocaleString()
                        : 'Date to be announced'}
                    </div>

                    <div className="event-detail">
                      <span>⌖</span>
                      {event.venue || 'Venue to be announced'}
                    </div>

                    <div className="event-card-footer">
                      <strong>
                        {event.ticketPrice != null
                          ? `₹${Number(event.ticketPrice).toFixed(2)}`
                          : 'Free'}
                      </strong>
                      <span className="view-label">Event details ↗</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="about-section" id="about">
          <div className="about-symbol">✦</div>
          <div>
            <span className="section-tag">ABOUT EVENTEASE</span>
            <h2>Less searching. More experiencing.</h2>
            <p>
              EventEase is a smart event management platform built to make
              discovering and managing events simpler. Our React frontend
              connects with a Spring Boot backend and MySQL database to
              display event information in one place.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-icon">✦</span>
          Event<span>Ease</span>
        </a>
        <p>Made for moments that matter.</p>
        <span>Smart Event Management System © 2026</span>
      </footer>
    </div>
  )
}

export default App
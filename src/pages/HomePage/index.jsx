import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
    
      <section className="hero">
        <h1>Discover Events from All Saudi Universities</h1>
        <p>
          Stay connected with your university’s cultural, academic, and social
          activities — all in one platform.
        </p>
        <button onClick={() => navigate("/events")}>Explore Events</button>
      </section>

      <section className="highlights">
        <div className="highlight-card">
          <h3>Universities Connected</h3>
          <p>View events from top Saudi universities like PNU, KSU, and more.</p>
        </div>
        <div className="highlight-card">
          <h3>Upcoming Events</h3>
          <p>Never miss out on upcoming seminars or conferences.</p>
        </div>
        <div className="highlight-card">
          <h3>Community Engagement</h3>
          <p>Encouraging collaboration and participation.</p>
        </div>
      </section>

    
    </div>
  );
}

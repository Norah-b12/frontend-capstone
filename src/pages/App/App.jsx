import { NavLink, Routes, Route } from "react-router-dom";
import HomePage from "../HomePage";
import EventsPage from "../EventPage";
import "./App.css";
import EventFormPage from "../EventFormPage";
import FavoritesPage from "../FavoritesPage";
import UniversitiesPage from "../UniversitiesPage";
import SignupPage from "../SignupPage";
import React, { useState, useEffect } from "react";

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">UniEvents</div>
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
            Home
          </NavLink>
          <NavLink to="/events" className={({ isActive }) => isActive ? "active" : ""}>
            Events
          </NavLink>
          <NavLink to="/universities" className={({ isActive }) => isActive ? "active" : ""}>
            Universities
          </NavLink>
          <NavLink to="/signup">Sign Up</NavLink>

        </div>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/new" element={<EventFormPage />} />
          <Route path="/events/:id/edit" element={<EventFormPage />} />
          <Route path="/events/new" element={<EventFormPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/universities" element={<UniversitiesPage />} />
          <Route path="/signup" element={<SignupPage setUser={setUser} />} />

        </Routes>
      </main>
    </div>
  );
}

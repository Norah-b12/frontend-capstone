import { NavLink, Routes, Route } from "react-router-dom";
import HomePage from "../HomePage";
import EventsPage from "../EventPage";
import "./App.css";
import EventFormPage from "../EventFormPage";
import FavoritesPage from "../FavoritesPage";

export default function App() {
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
        </div>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/new" element={<EventFormPage />} />
          <Route path="/events/:id/edit" element={<EventFormPage />} />
          <Route path="/events/new" element={<EventFormPage />} />
          <Route path="/events/:id/edit" element={<EventFormPage />} />   
          <Route path="/favorites" element={<FavoritesPage />} />

        </Routes>
      </main>
    </div>
  );
}

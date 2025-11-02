import { NavLink, Routes, Route, useNavigate, Link } from "react-router-dom";
import HomePage from "../HomePage";
import EventsPage from "../EventPage";
import "./App.css";
import EventFormPage from "../EventFormPage";
import FavoritesPage from "../FavoritesPage";
import UniversitiesPage from "../UniversitiesPage";
import SignupPage from "../SignupPage";
import React, { useState, useEffect } from "react";
import LoginPage from "../LoginPage";
import * as usersAPI from "../../utilities/users-api";
export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
const saved = usersAPI.getStoredUser();
if (saved) {
setUser(saved);
} else if (localStorage.getItem("access")) {
usersAPI.getMe()
.then((me) => {
localStorage.setItem("user", JSON.stringify(me));
setUser(me);
})
.catch(() => {
usersAPI.logout();
setUser(null);
});
}
}, []);
  function handleLogout(e) {
    e?.preventDefault?.();
    usersAPI.logout();
    setUser(null);
    navigate("/");
  }
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
          {!user ? (
            <>
              <li><Link to="/signup">Sign Up</Link></li>
              <li><Link to="/login">Log In</Link></li>
            </>
          ) : (
            <button onClick={handleLogout} className="logout-btn">Log Out</button>
          )}

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
          <Route path="/login" element={<LoginPage setUser={setUser} />} />

        </Routes>
      </main>
    </div>
  );
}

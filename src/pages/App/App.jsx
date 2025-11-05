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
import ProfilePage from "../ProfilePage";
import { Navigate } from "react-router-dom";

function OrganizerRoute({ me, children }) {
  if (!me) return <Navigate to="/login" replace />;
  if (me?.profile?.role !== "organizer") return <Navigate to="/events" replace />;
  return children;
}

export default function App() {
  const [me, setMe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = usersAPI.getStoredUser();
    if (saved) {
      setMe(saved);
    } else if (localStorage.getItem("access")) {
      usersAPI
        .getMe()
        .then((u) => {
          localStorage.setItem("user", JSON.stringify(u));
          setMe(u);
        })
        .catch(() => {
          usersAPI.logout();
          setMe(null);
        });
    }
  }, []);

  function handleLogout(e) {
    e?.preventDefault?.();
    usersAPI.logout();
    setMe(null);
    navigate("/");
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">UniEvents</div>
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>
          <NavLink to="/events" className={({ isActive }) => (isActive ? "active" : "")}>
            Events
          </NavLink>
          <NavLink to="/universities" className={({ isActive }) => (isActive ? "active" : "")}>
            Universities
          </NavLink>
          {me?.profile?.role === "organizer" && (
            <NavLink to="/events/new" className={({ isActive }) => (isActive ? "active" : "")}>
              + Create
            </NavLink>
          )}
          

          {!me ? (
            <>
              <li><Link to="/signup">Sign Up</Link></li>
              <li><Link to="/login">Log In</Link></li>
            </>
          ) : (
            <>
              <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
                My Profile
              </NavLink>
              <button onClick={handleLogout} className="logout-btn">Log Out</button>
            </>
          )}
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage me={me} />} />
          <Route path="/events" element={<EventsPage me={me} />} />
          <Route
            path="/events/new"
            element={
              <OrganizerRoute me={me}>
                <EventFormPage me={me} />
              </OrganizerRoute>
            }
          />
          <Route
            path="/events/:id/edit"
            element={
              <OrganizerRoute me={me}>
                <EventFormPage me={me} />
              </OrganizerRoute>
            }
          />
          <Route path="/favorites" element={<FavoritesPage me={me} />} />
          <Route path="/universities" element={<UniversitiesPage me={me} />} />
          <Route path="/signup" element={<SignupPage setUser={setMe} />} />
          <Route path="/login" element={<LoginPage setUser={setMe} />} />
          <Route path="/profile" element={<ProfilePage me={me} setUser={setMe} />} />
          
        </Routes>
      </main>
    </div>
  );
}
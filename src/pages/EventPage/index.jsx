import { useEffect, useState } from "react";
import {
    indexEvents as listEvents,
    listUniversities,
    deleteEvent,
    listFavorites,
    addFavorite,
    removeFavoriteByEvent
} from "../../utilities/event-api";
import "./style.css";
import { Link, useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

export default function EventPage({ me }) {

    const [searchParams] = useSearchParams();
    const universityIdFromUrl = searchParams.get("university") || "";

    const [events, setEvents] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [selectedUni, setSelectedUni] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [errMsg, setErrMsg] = useState("");
    const [favorites, setFavorites] = useState([]);
    const [allFavs, setAllFavs] = useState([]);

    const favoriteEventIds = new Set(favorites.map(f => f.event));

    const isOrganizer = me?.profile?.role === "organizer";
    const myUniId = me?.profile?.university ?? null;

    function getTimeString(timeStr) {
        if (!timeStr) return "";
        const [h, m] = timeStr.split(":");
        const hour = parseInt(h, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${m} ${ampm}`;
    }

    function daysUntilEvent(dateStr) {
        const eventDate = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);
        const diff = eventDate - today;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return {
            day: d.getDate(),
            month: d.toLocaleString('default', { month: 'short' }).toUpperCase(),
            weekday: d.toLocaleString('default', { weekday: 'short' })
        };
    }

    function getEventCategory(title) {
        const t = title.toLowerCase();
        if (t.includes("workshop") || t.includes("seminar")) return "workshop";
        if (t.includes("conference") || t.includes("summit")) return "conference";
        if (t.includes("party") || t.includes("social")) return "social";
        if (t.includes("sports") || t.includes("game")) return "sports";
        if (t.includes("career") || t.includes("job")) return "career";
        return "general";
    }

    function favoriteCount(eventId) {
        return allFavs.filter(f => f.event === eventId).length;
    }

    function isPopular(eventId) {
        const count = favoriteCount(eventId);
        if (count >= 5) return true;
        const allCounts = events.map(e => favoriteCount(e.id));
        const sorted = allCounts.sort((a, b) => b - a);
        const thresholdIndex = Math.round(sorted.length * 0.2) + 1;
        const threshold = sorted[thresholdIndex - 1] || 0;
        return count >= threshold && count > 0;
    }

    async function fetchEvents() {
        setLoading(true);
        setErrMsg("");
        try {
            const data = await listEvents({
                universityId: universityIdFromUrl || selectedUni || undefined,
                q: searchTerm || undefined
            });
            setEvents(data);
        } catch (e) {
            setErrMsg(e.message || "Error loading events");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const unis = await listUniversities();
                setUniversities(unis);
            } catch (err) {
                console.log("Failed to load unis", err);
            }
        })();
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [selectedUni, universityIdFromUrl]);

    async function loadFavorites() {
        try {
            const data = await listFavorites();
            setFavorites(data);

            let stored = localStorage.getItem("allFavorites");
            let all = stored ? JSON.parse(stored) : [];

            const currentUser = me?.id || "current_user";
            data.forEach(fav => {
                if (!all.some(a => a.event === fav.event && a.user === currentUser)) {
                    all.push({ ...fav, user: currentUser, timestamp: new Date().toISOString() });
                }
            });

            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            all = all.filter(f => new Date(f.timestamp) > thirtyDaysAgo);

            localStorage.setItem("allFavorites", JSON.stringify(all));
            setAllFavs(all);

        } catch (e) {
            console.error("fav load failed", e);
        }
    }

    useEffect(() => { loadFavorites(); }, []);

    async function toggleFavorite(eventId) {
        const currentUser = me?.id || "current_user";
        const isFav = favorites.some(f => f.event === eventId);

        try {
            if (isFav) {
                setAllFavs(prev => prev.filter(f => !(f.event === eventId && f.user === currentUser)));
                await removeFavoriteByEvent(eventId);
            } else {
                const newFav = { event: eventId, user: currentUser, timestamp: new Date().toISOString() };
                setAllFavs(prev => [...prev, newFav]);
                await addFavorite(eventId);
            }
            const data = await listFavorites();
            setFavorites(data);
        } catch (e) {
            console.error("Failed to toggle fav", e);
            alert("Oops, something went wrong");
            if (isFav) {
                setAllFavs(prev => [...prev, { event: eventId, user: currentUser, timestamp: new Date().toISOString() }]);
            } else {
                setAllFavs(prev => prev.filter(f => !(f.event === eventId && f.user === currentUser)));
            }
        }
    }

    function handleSearch(e) {
        e.preventDefault();
        fetchEvents();
    }

    return (
        <section className="container">
            <div className="page-header">
                <h1>Events</h1>

            </div>

            <form onSubmit={handleSearch} className="form">
                <div className="form-group">
                    <select value={selectedUni} onChange={e => setSelectedUni(e.target.value)}>
                        <option value="">All Universities</option>
                        {universities.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Search events"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <button type="submit" className="search-btn">
                    <i className="fas fa-search"></i> Search
                </button>
                {(selectedUni || searchTerm) && (
                    <button type="button" className="clear-btn" onClick={() => { setSelectedUni(""); setSearchTerm(""); fetchEvents(); }}>
                        <i className="fas fa-times"></i> Clear
                    </button>
                )}
            </form>

            {loading ? (
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading events...</p>
                </div>
            ) : errMsg ? (
                <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    <p>Error: {errMsg}</p>
                </div>
            ) : (
                <div className="events-container">                    {events.length === 0 && (
                    <div className="no-events">
                        <i className="fas fa-calendar-times"></i>
                        <h3>No events found</h3>
                        <p>Try adjusting your search or filters</p>
                    </div>
                )}
                    {events.map(ev => {
                        const canEdit = isOrganizer && myUniId === ev.university;
                        const isFav = favoriteEventIds.has(ev.id);
                        const daysLeft = daysUntilEvent(ev.date);
                        const dateObj = formatDate(ev.date);
                        const category = getEventCategory(ev.title);
                        const formattedTime = getTimeString(ev.time);
                        const favCount = favoriteCount(ev.id);
                        const mostLiked = isPopular(ev.id);

                        return (
                            <article key={ev.id} className="card">
                                <div className="card-header">
                                    <div className="event-date">
                                        <span className="date-weekday">{dateObj.weekday}</span>
                                        <span className="date-day">{dateObj.day}</span>
                                        <span className="date-month">{dateObj.month}</span>
                                    </div>
                                    <div className="event-meta">
                                        <span className={`event-category ${category}`}>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </span>
                                        {daysLeft > 0 && (
                                            <div className="days-left">
                                                {daysLeft} {daysLeft === 1 ? "day" : "days"} left
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="card-content">
                                    <h3>{ev.title}</h3>
                                    <p className="description">{ev.description || "No description available"}</p>

                                    <div className="event-details">
                                        <div className="detail-item">
                                            <span>{ev.location || "Location TBD"}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span>{ev.date}</span>
                                        </div>
                                        {formattedTime && (
                                            <div className="detail-item">
                                                <span>{formattedTime}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="card-footer">
                                        <div className="event-popularity">
                                            {mostLiked && <span className="popularity-badge most-liked">Most Liked</span>}
                                            {favCount > 0 && !mostLiked && <span className="popularity-badge liked">{favCount} like{favCount === 1 ? "" : "s"}</span>}
                                        </div>

                                        <div className="card-actions">
                                            {canEdit && (
                                                <div className="action-buttons">
                                                    <Link to={`/events/${ev.id}/edit`} className="edit-btn">Edit</Link>
                                                    <button onClick={async () => {
                                                        if (!confirm("Delete this event?")) return;
                                                        try { await deleteEvent(ev.id); fetchEvents(); } catch (e) { alert("Failed to delete") }
                                                    }} className="delete-btn">Delete</button>
                                                </div>
                                            )}

                                            <button type="button" className={`favorite-btn ${isFav ? "active" : ""}`} onClick={() => toggleFavorite(ev.id)} title={isFav ? "Remove from Favorites" : "Add to Favorites"}>
                                                {isFav ? "❤️" : "🤍"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </div>

            )}
        </section>
    );
}

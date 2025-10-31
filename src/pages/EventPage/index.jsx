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

export default function EventPage() {
    
    const [searchParams] = useSearchParams();
    const universityIdFromUrl = searchParams.get("university") || "";

    const [events, setEvents] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [universityId, setUniversityId] = useState("");
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [favorites, setFavorites] = useState([]);
    const favoriteEventIds = new Set(favorites.map(f => f.event));


    async function load() {
        setLoading(true);
        setErr("");
        try {
            const data = await listEvents({ universityId: universityIdFromUrl || undefined, q: q || undefined });
            setEvents(data);
        } catch (e) { setErr(e.message); }
        finally { setLoading(false); }
    }


    useEffect(() => { (async () => setUniversities(await listUniversities()))(); }, []);
    useEffect(() => { load(); }, [universityId]);

    function onSearch(e) {
        e.preventDefault();
        load();
    }
    async function loadFavorites() {
        try {
            const data = await listFavorites();
            setFavorites(data);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        loadFavorites();
    }, []);



    async function toggleFavorite(eventId) {
        try {
            const isFav = favorites.some(f => f.event === eventId);

            if (isFav) {
                await removeFavoriteByEvent(eventId);
            } else {
                await addFavorite(eventId);
            }

            const updatedFavorites = await listFavorites();
            setFavorites(updatedFavorites);
        } catch (e) {
            console.error(e);
            alert("Failed to toggle favorite");
        }
    }


    return (

        <section className="container">
            <div className="toolbar">
                <Link to="/events/new" className="create-btn">+ Create Event</Link>
            </div>
            <h1>Events</h1>

            <form onSubmit={onSearch} className="form">
                <select value={universityId} onChange={e => setUniversityId(e.target.value)}>
                    <option value="">All Universities</option>
                    {universities.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>

                <input placeholder="Search events" value={q} onChange={e => setQ(e.target.value)} />

                <button type="submit" className="search-btn">Search</button>

                {(universityId || q) &&
                    <button type="button" onClick={() => { setUniversityId(""); setQ(""); load(); }} className="clear-btn">
                        Clear
                    </button>
                }
            </form>

            {loading ? <p>Loading…</p> :
                err ? <p className="error">Error: {err}</p> :
                    <div className="grid">
                        {events.length === 0 && <p>No events found.</p>}
                        {events.map(ev => (
                            <article key={ev.id} className="card">
                                <h3>{ev.title}</h3>
                                <p className="university-name">{ev.university_name}</p>
                                <p className="description">{ev.description || "No description"}</p>
                                <p><b>Date:</b> {ev.date}{ev.time ? ` — ${ev.time}` : ""}</p>
                                <p><b>Location:</b> {ev.location || "—"}</p>
                                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                                    <a href={`/events/${ev.id}/edit`}>Edit</a>
                                    <button
                                        onClick={async () => {
                                            if (!confirm("Delete this event?")) return;
                                            try {
                                                await deleteEvent(ev.id);
                                                await load();
                                            } catch (e) {
                                                alert("Failed to delete");
                                            }
                                        }}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        type="button"
                                        className={`favorite-btn-modern ${favoriteEventIds.has(ev.id) ? "active" : ""}`}
                                        onClick={async () => await toggleFavorite(ev.id)}
                                        title={favoriteEventIds.has(ev.id) ? "Remove from Favorites" : "Add to Favorites"}
                                    >
                                        <i className={`fa${favoriteEventIds.has(ev.id) ? "s" : "r"} fa-heart`}></i>
                                    </button>



                                </div>

                            </article>
                        ))}

                    </div>
            }
        </section>
    );
}


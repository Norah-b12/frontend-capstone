import { useEffect, useState } from "react";
import { indexEvents as listEvents, listUniversities,deleteEvent } from "../../utilities/event-api";
import "./style.css";
import { Link } from "react-router-dom";
export default function EventPage() {
    const [events, setEvents] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [universityId, setUniversityId] = useState("");
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    async function load() {
        setLoading(true);
        setErr("");
        try {
            const data = await listEvents({ universityId: universityId || undefined, q: q || undefined });
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
                                </div>

                            </article>
                        ))}

                    </div>
            }
        </section>
    );
}

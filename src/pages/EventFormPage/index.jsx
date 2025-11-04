import { useEffect, useState,useRef } from "react";
import { useNavigate, useParams,Link } from "react-router-dom";
import "./styles.css";

import { 
  indexEvents as listEvents, 
  listUniversities, 
  deleteEvent, 
  listFavorites, 
  addFavorite, 
  removeFavoriteByEvent 
} from "../../utilities/event-api";
import { createEvent, showEvent, updateEvent } from "../../utilities/event-api";
export default function EventFormPage() {
    const { id } = useParams(); 
    const nav = useNavigate();
    const [universities, setUniversities] = useState([]);
    const [form, setForm] = useState({ title: "", description: "", date: "", time: "", location: "", university: "" });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState("");
    const hasFetchedUniversities = useRef(false);

      useEffect(() => {
        async function loadUniversitiesAndEvent() {
            if (!hasFetchedUniversities.current) {
                try {
                    const uniData = await listUniversities();
                    setUniversities(uniData);
                    hasFetchedUniversities.current = true;
                } catch (e) {
                    console.error("Failed to load universities:", e);
                }
            }

            if (id) {
                try {
                    const ev = await showEvent(id);
                    setForm({
                        title: ev.title ?? "",
                        description: ev.description ?? "",
                        date: ev.date ?? "",
                        time: ev.time ?? "",
                        location: ev.location ?? "",
                        university: ev.university ?? ""
                    });
                } catch (e) {
                    console.error("Failed to load event:", e);
                }
            }
        }

        loadUniversitiesAndEvent();
    }, [id]);

    function onChange(e) { setForm(p => ({ ...p, [e.target.name]: e.target.value })); }

    async function onSubmit(e) {
        e.preventDefault();
        setSaving(true); 
        setErr("");
        try {
            if (id) await updateEvent(id, form); else await createEvent(form);
            nav("/events");
        } catch (e) { setErr("Failed to save"); }
        finally { setSaving(false); }
    }

    return (
        <section className="event-form-container">
        <h1 className="event-form-title">{id ? "Edit Event" : "New Event"}</h1>
        {err && <p className="event-form-error">{err}</p>}
        <form onSubmit={onSubmit} className="event-form">
            <input
                name="title"
                value={form.title}
                onChange={onChange}
                placeholder="Title"
                required
                className="event-form-input"
            />
            <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                placeholder="Description"
                rows={4}
                className="event-form-textarea"
            />
            <div className="event-form-datetime">
                <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={onChange}
                    required
                    className="event-form-date"
                />
                <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={onChange}
                    className="event-form-time"
                />
            </div>
            <input
                name="location"
                value={form.location}
                onChange={onChange}
                placeholder="Location"
                className="event-form-input"
            />
            <select
                name="university"
                value={form.university}
                onChange={onChange}
                required
                className="event-form-select"
            >
                <option value="">Select university…</option>
                {universities.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                ))}
            </select>
            <div className="event-form-buttons">
                <button type="submit" disabled={saving} className="event-form-submit">
                    {saving ? "Saving…" : "Save"}
                </button>
                <button
                    type="button"
                    onClick={() => nav("/events")}
                    className="event-form-cancel"
                >
                    Cancel
                </button>
            </div>
        </form>
    </section>
);
}
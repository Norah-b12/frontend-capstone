import { useEffect, useState } from "react";
import { useNavigate, useParams,Link } from "react-router-dom";
import { 
  indexEvents as listEvents, 
  listUniversities, 
  deleteEvent, 
  listFavorites, 
  addFavorite, 
  removeFavoriteByEvent 
} from "../../utilities/event-api";
export default function EventFormPage() {
    const { id } = useParams(); 
    const nav = useNavigate();
    const [universities, setUniversities] = useState([]);
    const [form, setForm] = useState({ title: "", description: "", date: "", time: "", location: "", university: "" });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState("");

    useEffect(() => {
        (async () => {
            setUniversities(await listUniversities());
            if (id) {
                const ev = await showEvent(id);
                setForm({
                    title: ev.title ?? "",
                    description: ev.description ?? "",
                    date: ev.date ?? "",
                    time: ev.time ?? "",
                    location: ev.location ?? "",
                    university: ev.university ?? ""
                });
            }
        })();
    }, [id]);

    function onChange(e) { setForm(p => ({ ...p, [e.target.name]: e.target.value })); }

    async function onSubmit(e) {
        e.preventDefault();
        setSaving(true); setErr("");
        try {
            if (id) await updateEvent(id, form); else await createEvent(form);
            nav("/events");
        } catch (e) { setErr("Failed to save"); }
        finally { setSaving(false); }
    }

    return (
        <section>
            
            <h1>{id ? "Edit Event" : "New Event"}</h1>
            {err && <p style={{ color: "crimson" }}>{err}</p>}
            <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 520 }}>
                <input name="title" value={form.title} onChange={onChange} placeholder="Title" required />
                <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" rows={4} />
                <div style={{ display: "flex", gap: 8 }}>
                    <input type="date" name="date" value={form.date} onChange={onChange} required />
                    <input type="time" name="time" value={form.time} onChange={onChange} />
                </div>
                <input name="location" value={form.location} onChange={onChange} placeholder="Location" />
                <select name="university" value={form.university} onChange={onChange} required>
                    <option value="">Select university…</option>
                    {universities.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
                <div style={{ display: "flex", gap: 8 }}>
                    <button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
                    <button type="button" onClick={() => nav("/events")}>Cancel</button>
                </div>
            </form>
        </section>
    );
}

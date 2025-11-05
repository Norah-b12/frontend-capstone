import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
    indexEvents as listEvents,
    listUniversities,
    deleteEvent,
    listFavorites,
    addFavorite,
    removeFavoriteByEvent
} from "../../utilities/event-api";
import { createEvent, showEvent, updateEvent } from "../../utilities/event-api";
import "./styles.css";
import { getStoredUser } from "../../utilities/users-api";

export default function EventFormPage() {
    const { id } = useParams();
    const nav = useNavigate();
    const [universities, setUniversities] = useState([]);
    const [form, setForm] = useState({ title: "", description: "", date: "", time: "", location: "", university: "" });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState("");
    const [me, setMe] = useState(null);
    const hasFetchedUniversities = useRef(false);


    useEffect(() => {
        const user = getStoredUser();
        setMe(user);
    }, []);

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
            let submitData = { ...form };
            if (me?.profile?.role === 'organizer' && me?.profile?.university) {
                submitData.university = me.profile.university;
            }

            if (id) {
                await updateEvent(id, submitData);
            } else {
                await createEvent(submitData);
            }
            nav("/events");
        } catch (e) {
            setErr("Failed to save");
        } finally {
            setSaving(false);
        }
    }
    async function handleDelete() {
        if (!window.confirm("Are you sure you want to delete this event? This cannot be undone.")) return;
        try {
            await deleteEvent(id);
            nav("/events"); // Redirect after deletion
        } catch (err) {
            setErr("Failed to delete event. Please try again.");
        }
    }

    const getUniversityName = () => {
        if (me?.profile?.role === 'organizer' && me?.profile?.university) {
            const uni = universities.find(u => u.id === me.profile.university);
            return uni ? uni.name : 'Your University';
        } else if (form.university) {
            const uni = universities.find(u => u.id === parseInt(form.university));
            return uni ? uni.name : 'University not specified';
        }
        return '';
    };
    const getAvailableUniversities = () => {
        if (me?.profile?.role === 'organizer' && me?.profile?.university) {
            return universities.filter(u => u.id === me.profile.university);
        }
        return universities;
    };
    useEffect(() => {
        if (me?.profile?.role === 'organizer' && me?.profile?.university && !id) {
            setForm(prev => ({ ...prev, university: me.profile.university }));
        }
    }, [me, id]);


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
                {me?.profile?.role === 'organizer' ? (
                    <div className="university-display">
                        <label>University</label>
                        <div className="organizer-university">
                            {getUniversityName()}
                        </div>
                        <input
                            type="hidden"
                            name="university"
                            value={form.university}
                        />
                    </div>
                ) : (

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
                )}
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
                    {id && me?.profile?.role === 'organizer' && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="event-form-delete"
                        >
                            Delete Event
                        </button>
                    )}


                </div>
            </form>
        </section>
    );
}
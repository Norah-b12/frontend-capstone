import { useEffect, useState } from "react";
import * as usersAPI from "../../utilities/users-api";
import { listUniversities } from "../../utilities/event-api";
import { getFollowedUniversityIds } from "../../utilities/follow-universities";
import "./styles.css";

export default function ProfilePage() {
    const [me, setMe] = useState(null);
    const [form, setForm] = useState({ username: "", email: "" });
    const [msg, setMsg] = useState("");
    const [allUniversities, setAllUniversities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        usersAPI.getMe()
            .then((data) => {
                setMe(data);
                setForm({ username: data.username || "", email: data.email || "" });
                localStorage.setItem("user", JSON.stringify(data));
            })
            .catch(() => setMsg("Failed to load profile"));
    }, []);

    useEffect(() => {
        async function fetchUniversities() {
            try {
                const unis = await listUniversities();
                setAllUniversities(Array.isArray(unis) ? unis : []);
            } catch (err) {
                console.error("Failed to fetch universities:", err);
            }
        }
        fetchUniversities();
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    }

    async function handleSave(e) {
        e.preventDefault();
        setMsg("");
        setIsLoading(true);
        try {
            const payload = {};
            if (form.username !== me.username) payload.username = form.username;
            if (form.email !== me.email) payload.email = form.email;

            if (!payload.username && !payload.email) {
                setMsg("Nothing to update");
                setIsEditing(false);
                return;
            }

            const updated = await usersAPI.updateMe(payload);
            setMe(updated);
            localStorage.setItem("user", JSON.stringify(updated));
            setMsg("Changes saved successfully.");
            setIsEditing(false);
        } catch (err) {
            setMsg("Update failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    function handleEdit() {
        setIsEditing(true);
        setMsg("");
    }

    function handleCancel() {
        setForm({ username: me.username || "", email: me.email || "" });
        setIsEditing(false);
        setMsg("");
    }

    async function handleDelete() {
        if (!window.confirm("Delete your account? This cannot be undone.")) return;
        try {
            await usersAPI.deleteMe();
            usersAPI.logout();
            window.location.assign("/");
        } catch {
            setMsg("Delete failed. Please try again.");
        }
    }

    if (!me) return (
        <div className="loading">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
    );

    const followedIds = getFollowedUniversityIds();
    const followedUniversities = allUniversities.filter(uni => followedIds.includes(uni.id));

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/* Profile Header */}
                <div className="profile-header">
                    <div className="profile-info">
                        <h1>{me.username}</h1>
                        <p>{me.email}</p>
                    </div>
                    <div className="profile-stats">
                        <div className="stat">
                            <span className="stat-value">{me.favorites?.length || 0}</span>
                            <span className="stat-label">Favorites</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{followedUniversities.length}</span>
                            <span className="stat-label">Following</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="profile-tabs">
                    <button 
                        className={`tab ${activeTab === "profile" ? "active" : ""}`}
                        onClick={() => setActiveTab("profile")}
                    >
                        Profile
                    </button>
                    <button 
                        className={`tab ${activeTab === "activity" ? "active" : ""}`}
                        onClick={() => setActiveTab("activity")}
                    >
                        Activity
                    </button>
                    <button 
                        className={`tab ${activeTab === "settings" ? "active" : ""}`}
                        onClick={() => setActiveTab("settings")}
                    >
                        Settings
                    </button>
                </div>

                {/* Tab Content */}
                <div className="profile-content">
                    {activeTab === "profile" && (
                        <div className="content-card">
                            <div className="card-header">
                                <h2>Profile Information</h2>
                                {!isEditing && (
                                    <button className="edit-btn" onClick={handleEdit}>
                                        Edit
                                    </button>
                                )}
                            </div>
                            
                            {isEditing ? (
                                <form onSubmit={handleSave} className="profile-form">
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input 
                                            name="username" 
                                            value={form.username} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input 
                                            name="email" 
                                            type="email" 
                                            value={form.email} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                    <div className="form-actions">
                                        <button 
                                            type="submit" 
                                            className="btn-primary"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Saving...' : "Save"}
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={handleCancel} 
                                            className="btn-secondary"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="profile-details">
                                    <div className="detail-item">
                                        <span>Username</span>
                                        <span>{me.username}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span>Email</span>
                                        <span>{me.email}</span>
                                    </div>
                                </div>
                            )}
                            
                            {msg && <div className={`message ${msg.includes('success') ? 'success' : 'error'}`}>{msg}</div>}
                        </div>
                    )}

                    {activeTab === "activity" && (
                        <div className="content-card">
                            <h2>Your Activity</h2>
                            
                            <div className="activity-sections">
                                <div className="activity-section">
                                    <h3>Favorite Events</h3>
                                    {me.favorites && me.favorites.length > 0 ? (
                                        <div className="activity-list">
                                            {me.favorites.map((f) => (
                                                <div key={f.id} className="activity-item">
                                                    <span>{f.event_title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="empty">
                                            <p>No favorites yet</p>
                                        </div>
                                    )}
                                </div>

                                <div className="activity-section">
                                    <h3>Followed Universities</h3>
                                    {followedUniversities && followedUniversities.length > 0 ? (
                                        <div className="activity-list">
                                            {followedUniversities.map((u) => (
                                                <div key={u.id} className="activity-item">
                                                    <span>{u.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="empty">
                                            <p>No universities followed yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <div className="content-card">
                            <h2>Account Settings</h2>
                            <button 
                                type="button" 
                                onClick={handleDelete} 
                                className="btn-danger"
                            >
                                Delete Account
                            </button>
                            {msg && <div className={`message ${msg.includes('success') ? 'success' : 'error'}`}>{msg}</div>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
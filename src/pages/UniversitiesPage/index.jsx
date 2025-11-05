import { useEffect, useMemo, useState } from "react";
import { listUniversities } from "../../utilities/event-api";
import {
    getFollowedUniversityIds,
    isFollowed,
    toggleFollow,
} from "../../utilities/follow-universities";
import "./styles.css";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PNULogo from "../../images/PNU_logo-removebg-preview.png";
import AlYamamahLogo from "../../images/al yamamah.png";
import ImamLogo from "../../images/imam.png";
import KingSaudLogo from "../../images/king saud uni.png";
import PrinceSultanLogo from "../../images/prince sultan.png";
import * as usersAPI from "../../utilities/users-api";

export default function UniversitiesPage() {
    const [me, setMe] = useState(null);
    const [universities, setUniversities] = useState([]);
    const [q, setQ] = useState("");
    const [followed, setFollowed] = useState(getFollowedUniversityIds());
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const navigate = useNavigate();
    const [showFollowPrompt, setShowFollowPrompt] = useState(false);

    const universityImages = {
        1: PNULogo,
        5: AlYamamahLogo,
        3: ImamLogo,
        2: KingSaudLogo,
        4: PrinceSultanLogo
    };

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setErr("");
                const data = await listUniversities();
                setUniversities(Array.isArray(data) ? data : []);
            } catch (e) {
                setErr("Failed to load universities");
            } finally {
                setLoading(false);
            }
        })();
    }, []);
    useEffect(() => {
        usersAPI
            .getMe()
            .then((user) => setMe(user))
            .catch(() => setMe(null));
    }, []);

    function handleFollow(id) {
        if (!me) {
            setShowFollowPrompt(true);
            return;
        }
        const ids = toggleFollow(id);
        setFollowed([...ids]);
    }


    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        if (!term) return universities;
        return universities.filter((u) => u.name.toLowerCase().includes(term));
    }, [q, universities]);

    return (
        <section className="u-container">
            <header className="u-header">
                <div>
                    <h1 className="u-title">Universities</h1>
                    <p className="u-subtitle">
                        Follow universities you care about and view their events quickly.
                    </p>
                </div>

                <div className="u-actions">
                    <input
                        className="u-search"
                        placeholder="Search universities..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                    <a className="u-cta" href={`/events?followed=true`}>
                        Show Followed Events ({followed.length})
                    </a>
                </div>
            </header>

            {loading ? (
                <div className="u-state">Loading…</div>
            ) : err ? (
                <div className="u-state u-error">{err}</div>
            ) : (
                <div className="u-grid">
                    {filtered.length === 0 && (
                        <p className="u-empty">No universities found.</p>
                    )}

                    {filtered.map((u) => (
                        <article key={u.id} className="u-card">
                            <div className="u-card-head">
                                <img
                                    src={universityImages[u.id]}
                                    alt={u.name}
                                    className="u-logo"
                                />

                                <div className="u-card-title">
                                    <h3 className="u-name">{u.name}</h3>
                                    <span className="u-city">{u.city || "—"}</span>
                                </div>
                                <button
                                    className={`u-follow ${isFollowed(u.id) ? "is-followed" : ""}`}
                                    onClick={() => handleFollow(u.id)}
                                >
                                    {isFollowed(u.id) ? "Following" : "Follow"}
                                </button>

                            </div>

                            <div className="u-card-actions">
                                <Link className="u-view-events" to={`/events?university=${u.id}`}>
                                    View Events
                                </Link>
                            </div>
                        </article>
                    ))}


                </div>

            )}
            {showFollowPrompt && (
                <div className="confirm-overlay">
                    <div className="confirm-card">
                        <h3>Follow University</h3>
                        <p>To follow this university, please log in or sign up.</p>
                        <div className="confirm-buttons">
                            <button
                                className="btn-primary"
                                onClick={() => navigate("/login")}
                            >
                                Log me in
                            </button>
                            <button
                                className="btn-primary"
                                onClick={() => navigate("/signup")}
                            >
                                Sign me up
                            </button>
                            <button
                                className="btn-cancel"
                                onClick={() => setShowFollowPrompt(false)}
                            >
                                cancel
                            </button>
                        </div>
                    </div>
                </div>)}
        </section>

    );
}



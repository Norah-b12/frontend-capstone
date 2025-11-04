import { useEffect, useState } from "react";
import { 
  listFavorites,
  showEvent 
} from "../../utilities/event-api";
import "./styles.css";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const favoriteObjs = await listFavorites(); 
        const favoriteEvents = await Promise.all(
          favoriteObjs.map(fav => showEvent(fav.event))
        );
        setFavorites(favoriteEvents);
      } catch (e) {
        console.error(e);
        setError("Failed to load favorite events");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;

  return (
    <section>
      <h1>My Favorite Events</h1>
      {favorites.length === 0 ? (
        <p>No favorite events yet.</p>
      ) : (
        favorites.map(f => (
          <div key={f.id} className="card">
            <h3>{f.title}</h3>
            <p>{f.university_name}</p>
            <p>{f.date}{f.time ? ` — ${f.time}` : ""}</p>
            <p>{f.location || "—"}</p>
          </div>
        ))
      )}
    </section>
  );
}

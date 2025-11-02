const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default async function sendRequest(path, method = "GET", body) {
const opts = { method, headers: { "Content-Type": "application/json" } };
if (body) opts.body = JSON.stringify(body);
const res = await fetch(`${API}${path}`, opts);
if (!res.ok) throw await res.json().catch(() => new Error("Request failed"));
if (res.status === 204) return null;
return res.json();
}
const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default async function sendRequest(path, method = "GET", body) {
    const options = { method, headers: { "Content-Type": "application/json" } };
    const token = localStorage.getItem("access");
    if (token) options.headers.Authorization = `Bearer ${token}`;
    if (body) options.body = JSON.stringify(body);
    const res = await fetch(`${API}${path}`, options);
    if (!res.ok) throw await res.json().catch(() => new Error("Request failed"));
    return res.json();
}
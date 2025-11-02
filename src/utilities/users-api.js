import sendRequest from "./sendRequest";

export async function signup(formData) {
    const res = await sendRequest("/auth/signup/", "POST", formData);
    localStorage.setItem("access", res.access);
    localStorage.setItem("refresh", res.refresh);
    localStorage.setItem("user", JSON.stringify(res.user));
    return res.user; null
}
export async function login({ username, password }) {
    const data = await sendRequest("/auth/login/", "POST", { username, password });
    if (data?.access) localStorage.setItem("access", data.access);
    if (data?.refresh) localStorage.setItem("refresh", data.refresh);
    const me = await getMe();
    localStorage.setItem("user", JSON.stringify(me));
    return me;
}

export async function getMe() {
    return await sendRequest("/auth/me/", "GET");
}

export function getStoredUser() {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
}

export function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
}
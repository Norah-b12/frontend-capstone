import sendRequest from "./sendRequest";

export function getStoredUser() {
try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
}

export async function signup(formData) {
const data = await sendRequest("/auth/signup/", "POST", formData);
localStorage.setItem("access", data.access);
localStorage.setItem("refresh", data.refresh);
localStorage.setItem("user", JSON.stringify(data.user));
return data.user;
}

export async function login(formData) {
const data = await sendRequest("/auth/login/", "POST", formData);
localStorage.setItem("access", data.access);
localStorage.setItem("refresh", data.refresh);
const me = await getMe(); 
localStorage.setItem("user", JSON.stringify(me));
return me;
}

export function logout() {
localStorage.removeItem("access");
localStorage.removeItem("refresh");
localStorage.removeItem("user");
}

export async function getMe() {
return sendRequest("/auth/me/", "GET");
}

export async function updateMe(payload) {
const updated = await sendRequest("/auth/me/", "PUT", payload);
localStorage.setItem("user", JSON.stringify(updated));
return updated;
}

export async function deleteMe() {
await sendRequest("/auth/me/", "DELETE");
logout();
}



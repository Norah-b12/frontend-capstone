import sendRequest from "./sendRequest";

export async function signup(formData) {
// هنا المسار الصحيح
const data = await sendRequest("/auth/signup/", "POST", formData);
// (اختياري) خزنّي التوكنات لو رجعت من الباكند
if (data.access) localStorage.setItem("access", data.access);
if (data.refresh) localStorage.setItem("refresh", data.refresh);
if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
return data.user ?? null;
}

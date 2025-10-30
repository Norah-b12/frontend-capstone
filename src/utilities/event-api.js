import sendRequest from "./sendRequest";

const baseURL = "/events/";
export const indexEvents = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.universityId) params.append("university", filters.universityId); // keep 'university' to match backend
  if (filters.q) params.append("q", filters.q);
  const url = params.toString() ? `${baseURL}?${params.toString()}` : baseURL;
  return sendRequest(url);
};
export const showEvent = (id) => sendRequest(`${baseURL}${id}/`);
export const createEvent = (data) => sendRequest(baseURL, "POST", data);
export const updateEvent = (id, data) => sendRequest(`${baseURL}${id}/`, "PUT", data);
export const deleteEvent = (id) => sendRequest(`${baseURL}${id}/`, "DELETE");
export const listUniversities = () => sendRequest("/universities/");

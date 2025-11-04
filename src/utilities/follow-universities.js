const KEY = "followedUniversityIds";


function getUserId() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.id || "anonymous";
}
function load() {
    try { 
    const userId = getUserId();
    const userKey = `${KEY}_${userId}`;
    return JSON.parse(localStorage.getItem(userKey)) || []; }
    catch { return []; }
}
function save(ids) { 
    const userId = getUserId();
    const userKey = `${KEY}_${userId}`;
    localStorage.setItem(userKey, JSON.stringify(ids)); }

export function getFollowedUniversityIds() { return load(); }
export function isFollowed(id) { return load().includes(id); }

export function toggleFollow(id) {
    const ids = load();
    const i = ids.indexOf(id);
    if (i === -1) ids.push(id);
    else ids.splice(i, 1);
    save(ids);
    return ids;
}

export function clearFollows() {
    const userId = getUserId();
    const userKey = `${KEY}_${userId}`;
    localStorage.removeItem(userKey);
}

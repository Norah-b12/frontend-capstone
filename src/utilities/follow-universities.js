const KEY = "followedUniversityIds";

function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
}
function save(ids) { localStorage.setItem(KEY, JSON.stringify(ids)); }

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
    localStorage.removeItem(KEY);
}

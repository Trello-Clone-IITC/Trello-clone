import redis from "../redis.js";
export async function setCache(key, value, ttlSeconds) {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
}
export async function getCache(key) {
    const raw = await redis.get(key);
    const parsed = raw ? JSON.parse(raw) : null;
    console.log("Redis cached data:", parsed);
    return parsed;
}

import redis from "../redis.js";

export async function setCache<T>(key: string, value: T, ttlSeconds: number) {
  await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
}

export async function getCache<T>(key: string): Promise<T | null> {
  const raw = await redis.get(key);
  const parsed = raw ? (JSON.parse(raw) as T) : null;
  console.log(`Redis cached data for ${key}:`, parsed);
  Array.isArray(parsed) && console.log(`Number of items:`, parsed.length);

  return parsed;
}

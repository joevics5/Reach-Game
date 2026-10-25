// Tiny in-memory per-IP limiter. Good enough for one server instance; use Redis/Upstash when you scale out.
const hits = new Map<string, number[]>();

export function allow(ip: string, limitPerMinute: number): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  if (arr.length >= limitPerMinute) {
    hits.set(ip, arr);
    return false;
  }
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < 60_000)) hits.delete(k);
  return true;
}

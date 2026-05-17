/**
 * Edge-compatible rate limiter.
 *
 * Uses Upstash Redis if UPSTASH_REDIS_REST_URL is configured (recommended for
 * production — works across serverless instances).
 *
 * Falls back to an in-process Map for development / local testing.
 * NOTE: The in-process fallback resets on every cold start and does NOT
 * work correctly across multiple serverless instances. Configure Upstash
 * Redis for production rate limiting.
 *
 * Usage:
 *   const result = await rateLimit(identifier, { limit: 5, windowSeconds: 60 });
 *   if (!result.success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
 */

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

// In-process fallback store (dev only)
const store = new Map<string, { count: number; resetAt: number }>();

export async function rateLimit(
  identifier: string,
  options: { limit: number; windowSeconds: number }
): Promise<RateLimitResult> {
  const { limit, windowSeconds } = options;
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    return rateLimitUpstash(identifier, limit, windowSeconds, redisUrl, redisToken);
  }

  return rateLimitInProcess(identifier, limit, windowSeconds);
}

async function rateLimitUpstash(
  identifier: string,
  limit: number,
  windowSeconds: number,
  url: string,
  token: string
): Promise<RateLimitResult> {
  try {
    const key = `rl:${identifier}`;
    const now = Math.floor(Date.now() / 1000);
    const window = Math.floor(now / windowSeconds) * windowSeconds;
    const windowKey = `${key}:${window}`;

    // INCR + EXPIRE in a pipeline
    const pipeline = [
      ["INCR", windowKey],
      ["EXPIRE", windowKey, windowSeconds],
    ];

    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pipeline),
    });

    if (!res.ok) throw new Error("Upstash request failed");
    const [[, count]] = await res.json();
    const remaining = Math.max(0, limit - count);

    return {
      success: count <= limit,
      remaining,
      resetAt: window + windowSeconds,
    };
  } catch {
    // Fail open: if Redis is unavailable, allow the request
    return { success: true, remaining: 1, resetAt: 0 };
  }
}

function rateLimitInProcess(
  identifier: string,
  limit: number,
  windowSeconds: number
): RateLimitResult {
  const now = Date.now();
  const window = Math.floor(now / 1000 / windowSeconds) * windowSeconds * 1000;
  const key = `${identifier}:${window}`;

  const entry = store.get(key) ?? { count: 0, resetAt: window + windowSeconds * 1000 };
  entry.count++;
  store.set(key, entry);

  // Cleanup old keys periodically
  if (Math.random() < 0.01) {
    for (const [k, v] of store.entries()) {
      if (v.resetAt < now) store.delete(k);
    }
  }

  return {
    success: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    resetAt: Math.floor(entry.resetAt / 1000),
  };
}

/** Extract a usable rate-limit identifier from a request */
export function getRateLimitId(
  request: Request,
  suffix: string,
  userId?: string
): string {
  if (userId) return `user:${userId}:${suffix}`;
  const xff = request.headers.get("x-forwarded-for");
  const ip = xff ? xff.split(",")[0].trim() : "unknown";
  return `ip:${ip}:${suffix}`;
}

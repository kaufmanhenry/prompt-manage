type Key = string;

const buckets = new Map<Key, { tokens: number; resetAt: number }>();

export interface RateLimitOptions {
  windowMs: number;
  max: number;
}

export function createRateLimiter(options: RateLimitOptions) {
  const { windowMs, max } = options;
  return async function assertRateLimit(key: Key) {
    const now = Date.now();
    const bucket = buckets.get(key);
    if (!bucket || now > bucket.resetAt) {
      buckets.set(key, { tokens: max - 1, resetAt: now + windowMs });
      return;
    }
    if (bucket.tokens <= 0) {
      const err: any = new Error('Too Many Requests');
      err.status = 429;
      throw err;
    }
    bucket.tokens -= 1;
  };
}

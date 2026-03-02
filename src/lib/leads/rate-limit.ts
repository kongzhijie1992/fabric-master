const buckets = new Map<string, number[]>();

export function checkRateLimit(key: string, maxRequests: number, windowMs: number) {
  const now = Date.now();
  const existing = buckets.get(key) ?? [];

  const withinWindow = existing.filter((timestamp) => now - timestamp < windowMs);

  if (withinWindow.length >= maxRequests) {
    const earliest = withinWindow[0] ?? now;
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((windowMs - (now - earliest)) / 1000)
    };
  }

  withinWindow.push(now);
  buckets.set(key, withinWindow);

  return {
    allowed: true,
    retryAfterSeconds: 0
  };
}

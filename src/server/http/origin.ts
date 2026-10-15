import "server-only";

/** POST requests must come from the exact configured browser origin. */
export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const expected = process.env.APP_ORIGIN ?? new URL(request.url).origin;
  return origin === expected;
}

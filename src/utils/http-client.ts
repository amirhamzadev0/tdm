export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly issues?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiRequestInit {
  method?: "GET" | "POST";
  query?: Record<string, string | number | undefined>;
  body?: unknown;
  signal?: AbortSignal;
}

interface ApiPayload<T> {
  data?: T;
  error?: { message?: string; issues?: Record<string, string> };
}

/** Calls the named API operation and returns the `data` payload. */
export async function apiRequest<T>(operation: string, init: ApiRequestInit = {}): Promise<T> {
  const method = init.method ?? (init.body === undefined ? "GET" : "POST");
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(init.query ?? {})) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  const queryString = params.size > 0 ? `?${params.toString()}` : "";

  const response = await fetch(`/api/${operation}${queryString}`, {
    method,
    headers: init.body === undefined ? undefined : { "Content-Type": "application/json" },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    signal: init.signal,
  });

  let payload: ApiPayload<T> | null = null;
  try {
    payload = (await response.json()) as ApiPayload<T>;
  } catch {
    payload = null;
  }

  if (!response.ok || !payload || payload.data === undefined) {
    throw new ApiError(
      payload?.error?.message ?? "Something went wrong. Please try again.",
      response.status,
      payload?.error?.issues,
    );
  }
  return payload.data;
}

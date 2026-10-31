// One place that knows how to talk to the API: base URL, JSON, errors.
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(BASE_URL + path, {
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
    });
  } catch {
    // fetch only rejects when there is no response at all
    throw new ApiError(0, "Cannot reach the server. Is it running?");
  }
  if (!res.ok) throw new ApiError(res.status, `Request failed: ${res.status} ${res.statusText}`);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

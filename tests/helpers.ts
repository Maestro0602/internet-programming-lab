import { vi } from "vitest";
import type { CampusEvent } from "../src/types";
import db from "../db.json";

export const sampleEvents = db.events as CampusEvent[];

// A fake fetch: `routes` maps "METHOD /path" to a response body (or a status code for errors).
// Every call is recorded so tests can check what the app sent.
export function mockFetch(routes: Record<string, unknown>) {
  const calls: { method: string; path: string; body?: unknown }[] = [];
  const fn = vi.fn(async (url: string, init: RequestInit = {}) => {
    const method = init.method ?? "GET";
    const path = new URL(url).pathname + new URL(url).search;
    const body = init.body ? JSON.parse(String(init.body)) : undefined;
    calls.push({ method, path, body });
    const key = Object.keys(routes).find(k => k === `${method} ${path}` || k === `${method} ${path.split("?")[0]}`);
    if (!key) return new Response("not found", { status: 404, statusText: "Not Found" });
    const value = routes[key];
    if (typeof value === "number") return new Response("error", { status: value, statusText: "Error" });
    if (typeof value === "function") return Response.json(value(body));
    return Response.json(value);
  });
  vi.stubGlobal("fetch", fn);
  return calls;
}

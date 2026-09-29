import type { QueryResponse } from "./types";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "https://supportsage-production.up.railway.app";

export async function queryAgent(query: string): Promise<QueryResponse> {
  const res = await fetch(`${API_BASE}/api/v1/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }

  return res.json();
}

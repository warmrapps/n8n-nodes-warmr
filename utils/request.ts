import type { RequestInit } from "node-fetch";

export async function apiRequest<T = any>(
  url: string,
  options: Record<string, any> = {},
  apiKey?: string
): Promise<T> {
  const fetch = (await import("node-fetch")).default;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  } else if (process.env.WARMR_API_KEY) {
    headers["Authorization"] = `Bearer ${process.env.WARMR_API_KEY}`;
  }
  const response = await fetch(url, {
    ...options,
    headers,
  });
  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<T>;
}

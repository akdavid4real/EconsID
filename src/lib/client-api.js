import { getAccessToken } from "@/features/auth/browser-auth";

async function buildHeaders(extraHeaders = {}) {
  const headers = {
    ...extraHeaders,
  };

  const token = await getAccessToken().catch(() => "");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function parseResponse(response) {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload?.error ?? payload?.message ?? "Request failed";
    throw new Error(message);
  }
  return payload;
}

export async function postJson(path, body) {
  const response = await fetch(path, {
    method: "POST",
    headers: await buildHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });

  return parseResponse(response);
}

export async function fetchJson(path) {
  const response = await fetch(path, {
    method: "GET",
    headers: await buildHeaders(),
    cache: "no-store",
  });

  return parseResponse(response);
}

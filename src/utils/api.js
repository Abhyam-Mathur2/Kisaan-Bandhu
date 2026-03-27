/**
 * Shared API utility for all Supabase Edge Function calls.
 * Automatically includes the Supabase anon key in the Authorization header,
 * which is required by all Edge Functions even when JWT user-auth is disabled.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "https://qnmygtujnvlrcwblmqvd.supabase.co/functions/v1";

const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

/** Returns headers needed for every Edge Function request */
function getEdgeHeaders(extra = {}) {
  return {
    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    ...extra,
  };
}

/**
 * POST JSON to a Supabase Edge Function.
 * @param {string} fn  - Function name (e.g. "chat")
 * @param {object} body - JSON-serialisable body
 */
export async function edgePost(fn, body) {
  const res = await fetch(`${API_BASE_URL}/${fn}`, {
    method: "POST",
    headers: getEdgeHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[${fn}] ${res.status}: ${text}`);
  }
  return res.json();
}

/**
 * GET from a Supabase Edge Function (optional path suffix and query params).
 * @param {string} fn    - Function name (e.g. "voice-token")
 * @param {string} [suffix] - Optional path suffix (e.g. "/some-id")
 * @param {object} [params] - Optional query parameters
 */
export async function edgeGet(fn, suffix = "", params = {}) {
  const url = new URL(`${API_BASE_URL}/${fn}${suffix}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: getEdgeHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[${fn}] ${res.status}: ${text}`);
  }
  return res.json();
}

/**
 * POST multipart/form-data to a Supabase Edge Function (for file uploads).
 * @param {string} fn       - Function name (e.g. "voice-to-text")
 * @param {FormData} formData - FormData object
 */
export async function edgePostForm(fn, formData) {
  // Don't set Content-Type — browser sets it with boundary automatically
  const res = await fetch(`${API_BASE_URL}/${fn}`, {
    method: "POST",
    headers: getEdgeHeaders(),
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[${fn}] ${res.status}: ${text}`);
  }
  return res.json();
}

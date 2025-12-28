import { readSecret } from "@/lib/secrets"

/**
 * TheSportsDB helpers
 *
 * Notes:
 * - v2 requires the key in an `X-API-KEY` header and uses path-based endpoints.
 * - v2 docs currently don’t list a league standings/table endpoint, so we keep a
 *   small v1 helper for `lookuptable.php` (server-side only).
 */

const V2_BASE = "https://www.thesportsdb.com/api/v2/json"
const V1_BASE = "https://www.thesportsdb.com/api/v1/json"

export function normalizeSportsDbQuery(input: string): string {
  // v2 docs show underscore-separated examples (e.g. english_premier_league)
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_\-]/g, "")
}

async function fetchJson(url: string, init?: RequestInit) {
  const res = await fetch(url, { ...init, cache: "no-store" })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`TheSportsDB error ${res.status}: ${text}`)
  }
  return res.json()
}

export async function fetchSportsDbV2(path: string): Promise<any> {
  const apiKey = readSecret("SPORTS_DB_KEY")
  const url = new URL(V2_BASE + path)
  return fetchJson(url.toString(), {
    headers: {
      "X-API-KEY": apiKey,
    },
  })
}

/**
 * v1 helper for standings.
 *
 * Even though v1 embeds the key in the URL, this is only called from server-side
 * Next.js routes, so the key never reaches the browser.
 */
export async function fetchSportsDbV1(pathWithQuery: string): Promise<any> {
  const apiKey = readSecret("SPORTS_DB_KEY")
  const url = new URL(`${V1_BASE}/${encodeURIComponent(apiKey)}${pathWithQuery}`)
  return fetchJson(url.toString())
}

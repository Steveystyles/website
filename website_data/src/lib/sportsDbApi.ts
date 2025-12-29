const BASE_V2 = "https://www.thesportsdb.com/api/v2/json"

export async function fetchSportsDbV2(
  path: string,
  options?: { method?: "GET" | "POST" }
) {
  const apiKey = process.env.SPORTS_DB_KEY

  if (!apiKey) {
    console.error("❌ SPORTS_DB_KEY missing")
    return null
  }

  const url = `${BASE_V2}${path}`

  const res = await fetch(url, {
    method: options?.method ?? "GET",
    headers: {
      "X-API-KEY": apiKey,
    },
    cache: "no-store",
  })

  if (!res.ok) {
    console.error(`❌ SportsDB ${res.status} for ${url}`)
    return null
  }

  const text = await res.text()

  try {
    return JSON.parse(text)
  } catch {
    console.error(
      "❌ SportsDB returned non-JSON:",
      text.slice(0, 200)
    )
    return null
  }
}

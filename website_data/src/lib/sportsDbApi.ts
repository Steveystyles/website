const BASE_V2 = "https://www.thesportsdb.com/api/v2/json"

export async function fetchSportsDbV2(
  path: string,
  options?: { method?: "GET" | "POST" }
) {
  const apiKey = process.env.SPORTS_DB_KEY
  if (!apiKey) throw new Error("SPORTS_DB_KEY missing")

  const res = await fetch(
    `${BASE_V2}/${apiKey}${path}`, // 🔑 key in URL
    {
      method: options?.method ?? "GET",
      cache: "no-store",
    }
  )

  const text = await res.text()

  try {
    return JSON.parse(text)
  } catch {
    console.error("❌ SportsDB returned non-JSON:", text.slice(0, 200))
    return null
  }
}

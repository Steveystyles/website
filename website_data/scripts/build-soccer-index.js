import fs from "fs/promises"

const API = "https://www.thesportsdb.com/api/v2/json"
const KEY = process.env.SPORTS_DB_KEY

if (!KEY) {
  throw new Error("❌ SPORTS_DB_KEY is missing")
}

async function v2(path) {
  const res = await fetch(`${API}${path}`, {
    method: "GET",
    headers: {
      "X-API-KEY": KEY,
      "Accept": "application/json",
    },
  })

  const text = await res.text()

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`)
  }

  if (text.startsWith("<")) {
    throw new Error("❌ HTML response received from SportsDB")
  }

  return JSON.parse(text)
}

async function run() {
  console.log("🔄 Fetching leagues...")

  const leaguesRes = await v2("/all/leagues")

  // v2 payload variance handling
  const leagues =
    leaguesRes.all ||
    leaguesRes.data ||
    leaguesRes.leagues ||
    []

  if (!Array.isArray(leagues)) {
    console.error("❌ Unexpected leagues payload:", leaguesRes)
    throw new Error("Leagues payload is not an array")
  }

  // Exclude cups, international & continental competitions
  const EXCLUDED_LEAGUE_REGEX =
    /cup|trophy|friendly|friendlies|qualifying|qualification|playoff|play-offs|super\s?cup|shield|champions|europa|conference|world|international|africa|asian|concacaf|conmebol|uefa|fifa|olympic/i

  const soccerLeagues = leagues.filter(l =>
    l.strSport === "Soccer" &&
    l.idLeague &&
    l.strLeague &&
    !EXCLUDED_LEAGUE_REGEX.test(l.strLeague)
  )


  console.log(`⚽ Soccer leagues found: ${soccerLeagues.length}`)

  const index = []

  for (const league of soccerLeagues) {
    if (league.strLeague === "_No League") continue
    console.log(`→ Fetching teams for ${league.strLeague}`)

    const teamsRes = await v2(
      `/list/teams/${league.idLeague}`
    )

    const teams =
      teamsRes.list ||
      teamsRes.all ||
      teamsRes.data ||
      teamsRes.teams ||
      []

    if (!Array.isArray(teams) || teams.length === 0) {
      continue
    }

    index.push({
      idLeague: league.idLeague,
      name: league.strLeague,
      teams: teams.map(t => ({
        idTeam: String(t.idTeam),
        name: t.strTeam,
        badge: t.strBadge || undefined,
      })),
    })
  }
  await fs.mkdir("data/sportsdb", { recursive: true })
  await fs.writeFile(
    "data/sportsdb/soccer-index.json",
    JSON.stringify(index, null, 2)
  )

  console.log("✅ Soccer index built successfully")
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})

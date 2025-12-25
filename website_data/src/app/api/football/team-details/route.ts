type SportsDbTeam = {
  idTeam?: string | number
  strTeam?: string | null
  strManager?: string | null
  strTeamBadge?: string | null
}

type SportsDbEvent = {
  idHomeTeam?: string | number
  idAwayTeam?: string | number
  strHomeTeam?: string | null
  strAwayTeam?: string | null
  dateEvent?: string | null
  strTimestamp?: string | null
}

type TeamDetails = {
  teamName: string
  manager: string
  leaguePosition: number
  crest?: string | null
  nextMatch: {
    opponent: string
    date: string
    homeAway: "H" | "A"
  }
}

function normalizeDate(raw?: string | null) {
  if (!raw) return null
  const asDate = new Date(raw)
  return Number.isNaN(asDate.getTime()) ? null : asDate.toISOString()
}

async function fetchTeamProfile(
  apiKey: string,
  teamId: string
): Promise<{ teamName: string; manager: string; crest: string | null } | null> {
  const res = await fetch(
    `https://www.thesportsdb.com/api/v1/json/${apiKey}/lookupteam.php?id=${teamId}`,
    { cache: "no-store" }
  )

  if (!res.ok) return null

  const json = (await res.json()) as { teams?: SportsDbTeam[] }
  const team = (json.teams ?? [])[0]
  if (!team) return null

  return {
    teamName: team.strTeam ?? "Unknown team",
    manager: team.strManager ?? "Unknown manager",
    crest: team.strTeamBadge?.replace(/^http:\/\//, "https://") ?? null,
  }
}

async function fetchNextMatch(
  apiKey: string,
  teamId: string
): Promise<TeamDetails["nextMatch"] | null> {
  const res = await fetch(
    `https://www.thesportsdb.com/api/v1/json/${apiKey}/eventsnext.php?id=${teamId}`,
    { cache: "no-store" }
  )

  if (!res.ok) return null

  const json = (await res.json()) as { events?: SportsDbEvent[] }
  const event = (json.events ?? [])[0]
  if (!event) return null

  const isHome = String(event.idHomeTeam ?? "") === teamId
  const opponent = isHome ? event.strAwayTeam : event.strHomeTeam
  const date =
    normalizeDate(event.strTimestamp) ?? normalizeDate(event.dateEvent) ?? new Date().toISOString()

  const homeAway: TeamDetails["nextMatch"]["homeAway"] = isHome ? "H" : "A"

  return {
    opponent: opponent ?? "TBD",
    date,
    homeAway,
  }
}

async function fetchLeaguePosition(
  apiKey: string,
  leagueId: string | null,
  season: string | null,
  teamId: string
) {
  if (!leagueId || !season) return null

  const res = await fetch(
    `https://www.thesportsdb.com/api/v1/json/${apiKey}/lookuptable.php?l=${leagueId}&s=${season}`,
    { cache: "no-store" }
  )

  if (!res.ok) return null

  const json = (await res.json()) as { table?: { idTeam?: string | number; intRank?: string | number }[] }
  const row = (json.table ?? []).find((entry) => String(entry.idTeam ?? "") === teamId)
  if (!row) return null

  const parsed = Number(row.intRank)
  return Number.isFinite(parsed) ? parsed : null
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const teamId = searchParams.get("teamId")
  const leagueId = searchParams.get("leagueId")
  const season = searchParams.get("season")

  if (!teamId) {
    return Response.json({ error: "teamId is required" }, { status: 400 })
  }

  const envKey = process.env.THESPORTSDB_API_KEY?.trim()
  const keys = Array.from(new Set(["123", envKey, "3"].filter(Boolean))) as string[]

  let profile:
    | {
        teamName: string
        manager: string
        crest: string | null
      }
    | null = null
  let nextMatch: TeamDetails["nextMatch"] | null = null
  let leaguePosition: number | null = null

  for (const key of keys) {
    if (!profile) {
      profile = await fetchTeamProfile(key, teamId)
    }
    if (!nextMatch) {
      nextMatch = await fetchNextMatch(key, teamId)
    }
    if (leaguePosition === null) {
      leaguePosition = await fetchLeaguePosition(key, leagueId, season, teamId)
    }

    if (profile && nextMatch && leaguePosition !== null) {
      break
    }
  }

  const response: TeamDetails = {
    teamName: profile?.teamName ?? "Unknown team",
    manager: profile?.manager ?? "Unavailable",
    crest: profile?.crest,
    leaguePosition: leaguePosition ?? 0,
    nextMatch:
      nextMatch ?? {
        opponent: "TBD",
        date: new Date().toISOString(),
        homeAway: "H",
      },
  }

  return Response.json(response)
}

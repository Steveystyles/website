import { LiveMatch } from "@/components/LiveScores/types"
import { LEAGUE_COUNTRY_MAP } from "./leagueCountryMap"

function parseStatus(
  status: string,
  kickoff?: string,
  dateEvent?: string
): "LIVE" | "FT" | "NS" {
  if (status === "FT") return "FT"
  if (status !== "1H" && status !== "2H") return "NS"

  if (kickoff && dateEvent) {
    const kickoffDate = new Date(`${dateEvent}T${kickoff}`)
    const now = new Date()

    const diffHours =
      (now.getTime() - kickoffDate.getTime()) / (1000 * 60 * 60)

    if (diffHours > 3) {
      return "FT"
    }
  }

  return "LIVE"
}

function parseMinute(
  status: string,
  progress?: string | null
): number | undefined {
  if (status !== "1H" && status !== "2H") return undefined
  if (!progress) return undefined

  const minute = Number(progress)
  if (!Number.isFinite(minute) || minute <= 0) return undefined

  return minute
}

export function normaliseSportsDb(data: any): LiveMatch[] {
  const events =
    data?.events ??
    data?.livescore ??
    data?.livescores ??
    []

  if (!Array.isArray(events)) return []

  return events.map((e: any): LiveMatch => {
    const league = String(e.strLeague ?? "").trim()

    return {
      matchId: String(e.idLiveScore ?? e.idEvent),
      eventId: String(e.idEvent),
      home: String(e.strHomeTeam ?? ""),
      away: String(e.strAwayTeam ?? ""),
      homeScore: Number(e.intHomeScore ?? 0),
      awayScore: Number(e.intAwayScore ?? 0),
      homeBadge: e.strHomeTeamBadge ?? undefined,
      awayBadge: e.strAwayTeamBadge ?? undefined,
      status: parseStatus(e.strStatus, e.strEventTime, e.dateEvent),
      minute: parseMinute(e.strStatus, e.strProgress),
      kickoff: e.strEventTime ?? "",
      league,
      country:
        e.strCountry ||
        e.strLeagueCountry ||
        LEAGUE_COUNTRY_MAP[league] ||
        "Other",
    }
  })
}

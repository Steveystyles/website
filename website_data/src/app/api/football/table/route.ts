import { NextResponse } from "next/server"
import { fetchSportsDbV1 } from "@/lib/sportsDbApi"

export const runtime = "nodejs"

type SportsDbTableRow = {
  intRank?: string | number
  idTeam?: string | number
  strTeam?: string
  intWin?: string | number
  intLoss?: string | number
  intGoalDifference?: string | number
  intPoints?: string | number
  strTeamBadge?: string
  strLeague?: string
}

export type LeagueRow = {
  position: number
  teamId: string
  teamName: string
  won: number
  lost: number
  goalDifference: number
  points: number
  crest: string
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const leagueId = searchParams.get("leagueId")
  const season = searchParams.get("season") ?? ""

  if (!leagueId) {
    return NextResponse.json({ error: "Missing leagueId" }, { status: 400 })
  }

  try {
    const qs = new URLSearchParams({ l: leagueId })
    if (season) qs.set("s", season)

    // v1 endpoint:
    // /lookuptable.php?l=4328&s=2020-2021
    const json = await fetchSportsDbV1(`/lookuptable.php?${qs.toString()}`)
    const table: SportsDbTableRow[] = json?.table ?? []

    const rows: LeagueRow[] = table
      .map((r) => {
        const position = Number(r.intRank ?? 0)
        const teamId = String(r.idTeam ?? "")
        const teamName = String(r.strTeam ?? "")
        const won = Number(r.intWin ?? 0)
        const lost = Number(r.intLoss ?? 0)
        const goalDifference = Number(r.intGoalDifference ?? 0)
        const points = Number(r.intPoints ?? 0)
        const crest = String(r.strTeamBadge ?? "")
        return { position, teamId, teamName, won, lost, goalDifference, points, crest }
      })
      .filter((r) => r.position > 0 && r.teamId.length > 0)
      .sort((a, b) => a.position - b.position)

    const leagueName = String(table?.[0]?.strLeague ?? "")
    return NextResponse.json({ rows, leagueName })
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Table lookup failed" },
      { status: 500 }
    )
  }
}

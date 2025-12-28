export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { fetchSportsDbV1 } from "@/lib/sportsDbApi"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const leagueId = searchParams.get("leagueId")
  const season = searchParams.get("season") ?? "2024-2025"

  if (!leagueId) {
    return NextResponse.json({ rows: [] })
  }

  const json = await fetchSportsDbV1(
    `/lookuptable.php?l=${leagueId}&s=${season}`
  )

  const rows =
    json?.table?.map((r: any) => ({
      position: Number(r.intRank),
      teamId: r.idTeam,
      teamName: r.strTeam,
      points: Number(r.intPoints),
      goalDifference: Number(r.intGoalDifference),
      crest: r.strBadge,
    })) ?? []

  return NextResponse.json({ rows })
}

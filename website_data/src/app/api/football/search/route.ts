export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { fetchSportsDbV2 } from "@/lib/sportsDbApi"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")

  if (!q || q.length < 2) {
    return NextResponse.json({ teams: [], leagues: [] })
  }

  const [teamsRes, leaguesRes] = await Promise.all([
    fetchSportsDbV2(`/searchteams.php?t=${encodeURIComponent(q)}`),
    fetchSportsDbV2(`/search_all_leagues.php?l=${encodeURIComponent(q)}`),
  ])

  return NextResponse.json({
    teams: teamsRes?.teams ?? [],
    leagues: leaguesRes?.leagues ?? [],
  })
}

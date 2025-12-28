import { NextResponse } from "next/server"
import { fetchSportsDbV2, normalizeSportsDbQuery } from "@/lib/sportsDbApi"

export const runtime = "nodejs"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const qRaw = searchParams.get("q") ?? ""
  const q = normalizeSportsDbQuery(qRaw)

  if (q.length < 2) {
    return NextResponse.json({ leagues: [], teams: [] })
  }

  try {
    const [leagueJson, teamJson] = await Promise.all([
      fetchSportsDbV2(`/search/league/${encodeURIComponent(q)}`),
      fetchSportsDbV2(`/search/team/${encodeURIComponent(q)}`),
    ])

    return NextResponse.json({
      leagues: leagueJson?.leagues ?? [],
      teams: teamJson?.teams ?? [],
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Search failed" },
      { status: 500 }
    )
  }
}

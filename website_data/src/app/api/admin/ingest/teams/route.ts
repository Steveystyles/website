export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { fetchSportsDbV2 } from "@/lib/sportsDbApi"
import { db } from "@/lib/search-db/db"

export async function POST() {
  try {
    const leagues = db
      .prepare(`SELECT id FROM search_index WHERE type = 'league'`)
      .all() as { id: string }[]

    const insert = db.prepare(`
      INSERT OR REPLACE INTO search_index
      (id, name, type, sport, country, badge, league_id, search_text)
      VALUES (?, ?, 'team', ?, ?, ?, ?, ?)
    `)

    let teamsInserted = 0
    const failedLeagues: string[] = []

    for (const { id: leagueId } of leagues) {
      const data = await fetchSportsDbV2(
        `/list/teams/league/${leagueId}`,
        { method: "POST" }
      )

      const teams = data?.team   // ✅ v2 uses `team`

      if (!Array.isArray(teams)) {
        failedLeagues.push(leagueId)
        continue
      }

      const tx = db.transaction((teams: any[]) => {
        for (const t of teams) {
          if (!t?.idTeam || !t?.strTeam) continue

          const searchText = [
            t.strTeam,
            t.strCountry,
            t.strLeague,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()

          insert.run(
            t.idTeam,
            t.strTeam,
            "Soccer",
            t.strCountry ?? null,
            t.strBadge ?? null,
            leagueId,
            searchText
          )

          teamsInserted++
        }
      })

      tx(teams)
    }

    return NextResponse.json({
      leaguesProcessed: leagues.length,
      teamsInserted,
      failedLeagues,
    })
  } catch (err: any) {
    console.error("🔥 INGEST TEAMS CRASHED", err)
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    )
  }
}

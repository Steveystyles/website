export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { fetchSportsDbV2 } from "@/lib/sportsDbApi"
import { db } from "@/lib/search-db/db"

export async function POST() {
  const leagues = db
    .prepare(`SELECT id FROM search_index WHERE type = 'league'`)
    .all()

  const insert = db.prepare(`
    INSERT OR REPLACE INTO search_index
    (id, name, type, sport, country, badge, league_id, search_text)
    VALUES (?, ?, 'team', ?, ?, ?, ?, ?)
  `)

  const failedLeagues: string[] = []
  let teamsInserted = 0

  for (const l of leagues) {
    const leagueId = l.id

    const data = await fetchSportsDbV2(
      `/teams/league/${leagueId}`,
      { method: "GET" }
    )

    if (!data?.teams || !Array.isArray(data.teams)) {
      failedLeagues.push(leagueId)
      continue
    }

    const tx = db.transaction((teams: any[]) => {
      for (const t of teams) {
        if (!t.idTeam || !t.strTeam) continue

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

    tx(data.teams)
  }

  return NextResponse.json({
    leaguesProcessed: leagues.length,
    teamsInserted,
    failedLeagues,
  })
}

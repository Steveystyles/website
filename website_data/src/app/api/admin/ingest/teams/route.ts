export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { fetchSportsDbV2 } from "@/lib/sportsDbApi"
import { db } from "@/lib/search-db/db"

export async function POST() {
  // Get all leagues already ingested
  const leagues = db
    .prepare("SELECT id FROM search_index WHERE type = 'league'")
    .all() as { id: string }[]

  if (!leagues.length) {
    return NextResponse.json(
      { error: "No leagues found. Run leagues ingest first." },
      { status: 400 }
    )
  }

  const insert = db.prepare(`
    INSERT OR REPLACE INTO search_index
    (id, name, type, sport, country, badge, league_id, search_text)
    VALUES (?, ?, 'team', ?, ?, ?, ?, ?)
  `)

  let inserted = 0

  const tx = db.transaction((rows: any[]) => {
    for (const t of rows) {
      if (!t?.idTeam || !t?.strTeam) continue

      const searchText = [
        t.strTeam,
        t.strLeague,
        t.strCountry,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      insert.run(
        t.idTeam,
        t.strTeam,
        t.strSport ?? null,
        t.strCountry ?? null,
        t.strBadge ?? null,
        t.idLeague ?? null,
        searchText
      )

      inserted++
    }
  })

  for (const league of leagues) {
    const data = await fetchSportsDbV2(
      `/lookup_all_teams.php?id=${league.id}`
    )

    const teams = data?.teams ?? []
    if (teams.length) tx(teams)
  }

  return NextResponse.json({ inserted })
}

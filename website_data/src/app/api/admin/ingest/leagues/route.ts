export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { fetchSportsDbV2 } from "@/lib/sportsDbApi"
import { db } from "@/lib/search-db/db"

export async function POST() {
  const data = await fetchSportsDbV2("/all/leagues", { method: "POST" })

  const leagues = data?.leagues ?? data?.all

  if (!Array.isArray(leagues)) {
    return NextResponse.json(
      { error: "No leagues array found", raw: data },
      { status: 500 }
    )
  }

  const insert = db.prepare(`
    INSERT OR REPLACE INTO search_index
    (id, name, type, sport, country, badge, league_id, search_text)
    VALUES (?, ?, 'league', ?, ?, ?, NULL, ?)
  `)

  const tx = db.transaction((items: any[]) => {
    for (const l of items) {
      const name = l.strLeague?.trim()
      if (!name || !l.idLeague) continue

      const searchText = [
        name,
        l.strCountry,
        l.strSport,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      insert.run(
        l.idLeague,
        name,
        l.strSport ?? null,
        l.strCountry ?? null,
        l.strBadge ?? null,
        searchText
      )
    }
  })

  tx(leagues)

  return NextResponse.json({
    inserted: leagues.length,
  })
}

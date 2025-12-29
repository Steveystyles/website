export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { db } from "@/lib/search-db/db"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")?.toLowerCase() ?? ""

  if (q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const results = db
    .prepare(`
      SELECT id, name, type, badge, league_id
      FROM search_index
      WHERE search_text LIKE ?
      ORDER BY type DESC, name ASC
      LIMIT 20
    `)
    .all(`%${q}%`)

  return NextResponse.json({ results })
}

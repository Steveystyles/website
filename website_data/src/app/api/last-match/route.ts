import { NextResponse } from "next/server"

const API_KEY = process.env.SPORTS_DB_KEY!

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const teamId = searchParams.get("team")

  if (!teamId) {
    return NextResponse.json({ error: "Missing team" }, { status: 400 })
  }

  const res = await fetch(
    `https://www.thesportsdb.com/api/v1/json/${API_KEY}/eventslast.php?id=${teamId}`,
    { cache: "no-store" }
  )

  const json = await res.json()

  return NextResponse.json(json)
}

import { NextResponse } from "next/server"

const API = "https://www.thesportsdb.com/api/v1/json"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const idLeague = searchParams.get("league")

  if (!idLeague) {
    return NextResponse.json(
      { error: "Missing league id" },
      { status: 400 }
    )
  }

  const key = process.env.SPORTS_DB_KEY
  if (!key) {
    return NextResponse.json(
      { error: "Server API key missing" },
      { status: 500 }
    )
  }

  const res = await fetch(
    `${API}/${key}/lookuptable.php?l=${idLeague}`,
    { cache: "no-store" }
  )

  const text = await res.text()

  if (!res.ok || text.startsWith("<")) {
    return NextResponse.json(
      { error: "SportsDB v1 failed" },
      { status: 502 }
    )
  }

  return NextResponse.json(JSON.parse(text))
}

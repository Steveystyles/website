import { NextResponse } from "next/server"

const API = "https://www.thesportsdb.com/api/v2/json"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const idTeam = searchParams.get("team")

  if (!idTeam) {
    return NextResponse.json(
      { error: "Missing team id" },
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

  const res = await fetch(`${API}/lookup/team/${idTeam}`, {
    headers: {
      "X-API-KEY": key,
      Accept: "application/json",
    },
    cache: "no-store",
  })

  const text = await res.text()

  if (!res.ok || text.startsWith("<")) {
    return NextResponse.json(
      { error: "SportsDB v2 failed" },
      { status: 502 }
    )
  }

  return NextResponse.json(JSON.parse(text))
}

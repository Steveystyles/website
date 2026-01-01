import { NextResponse } from "next/server"

export async function GET() {
  const key = process.env.SPORTS_DB_KEY

  if (!key) {
    return NextResponse.json(
      { error: "Missing SPORTS_DB_KEY" },
      { status: 500 }
    )
  }

  const res = await fetch(
    "https://www.thesportsdb.com/api/v2/json/livescore/soccer",
    {
      cache: "no-store",
      headers: {
        "X-API-KEY": key,
      },
    }
  )

  if (!res.ok) {
    return NextResponse.json(
      { error: "TheSportsDB v2 request failed" },
      { status: 502 }
    )
  }

  return NextResponse.json(await res.json())
}

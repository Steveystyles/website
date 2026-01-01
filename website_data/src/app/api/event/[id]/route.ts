export const runtime = "nodejs"

import { NextResponse } from "next/server"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const apiKey = process.env.SPORTS_DB_KEY

  console.log("EVENT ROUTE HIT")
  console.log("EVENT ID:", id)

  if (!id) {
    return NextResponse.json(
      { error: "Missing event id" },
      { status: 400 }
    )
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing SPORTS_DB_KEY" },
      { status: 500 }
    )
  }

  const res = await fetch(
    `https://www.thesportsdb.com/api/v2/json/lookup/event/${id}`,
    {
      headers: {
        "X-API-KEY": apiKey,
      },
      cache: "no-store",
    }
  )

  const text = await res.text()

  console.log("UPSTREAM STATUS:", res.status)

  if (!res.ok) {
    return NextResponse.json(
      { error: "Upstream error", body: text },
      { status: res.status }
    )
  }

  return new NextResponse(text, {
    headers: { "Content-Type": "application/json" },
  })
}

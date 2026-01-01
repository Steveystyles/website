export const runtime = "nodejs"

import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  context: { params?: { id?: string } }
) {
  // 🔍 Log what Next is actually passing
  console.log("TIMELINE ROUTE HIT")
  console.log("CONTEXT PARAMS:", context.params)

  // Primary: params.id
  let id = context.params?.id

  // Fallback: parse from URL (robust against App Router quirks)
  if (!id) {
    const url = new URL(req.url)
    id = url.pathname.split("/").pop() ?? undefined
  }

  console.log("RESOLVED EVENT ID:", id)

  const apiKey = process.env.SPORTS_DB_KEY

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
    `https://www.thesportsdb.com/api/v2/json/lookup/event_timeline/${id}`,
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

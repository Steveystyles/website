import { NextResponse } from "next/server"
import { fetchSportsDbV2 } from "@/lib/sportsDbApi"

export const runtime = "nodejs"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  try {
    const json = await fetchSportsDbV2(`/lookup/league/${encodeURIComponent(id)}`)
    // v2 returns `{ leagues: [...] }`
    const league = json?.leagues?.[0] ?? null
    return NextResponse.json({ league })
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "League lookup failed" },
      { status: 500 }
    )
  }
}

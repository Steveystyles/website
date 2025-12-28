export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { fetchSportsDbV2 } from "@/lib/sportsDbApi"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json(null)
  }

  const data = await fetchSportsDbV2(`/lookupleague.php?id=${id}`)
  return NextResponse.json(data?.leagues?.[0] ?? null)
}

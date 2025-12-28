export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { db } from "@/lib/search-db/db"

export async function GET() {
  const result = db
    .prepare("SELECT COUNT(*) as count FROM search_index")
    .get()

  return NextResponse.json(result)
}

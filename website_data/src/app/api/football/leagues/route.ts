import { prisma } from "@/lib/prisma"

export async function GET() {
  const leagues = await prisma.footballLeague.findMany({
    where: { source: "thesportsdb" },
    orderBy: { name: "asc" },
  })

  return Response.json(
    leagues.map((l) => ({
      id: l.id,
      name: l.name,
      season: "2024-2025",
    }))
  )
}

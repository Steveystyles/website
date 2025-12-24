import crypto from "crypto"
import { prisma } from "@/lib/prisma"

const URL =
  "https://www.thesportsdb.com/api/v1/json/123/all_leagues.php"

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex")
}

async function main() {
  const res = await fetch(URL)
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)

  const raw = await res.text()
  const hash = sha256(raw)

  const metaKey = "thesportsdb_leagues_hash"
  const existing = await prisma.footballMeta.findUnique({
    where: { key: metaKey },
  })

  if (existing?.value === hash) {
    console.log("✅ Leagues unchanged. No update needed.")
    return
  }

  const json = JSON.parse(raw)
  const leagues = (json.leagues ?? []).filter(
    (l: any) => l.strSport === "Soccer"
  )

  // Replace existing list
  await prisma.$transaction(async (tx) => {
    await tx.footballLeague.deleteMany({
      where: { source: "thesportsdb" },
    })

    await tx.footballLeague.createMany({
      data: leagues.map((l: any) => ({
        id: String(l.idLeague),
        name: String(l.strLeague),
        sport: String(l.strSport),
        country: l.strCountry ? String(l.strCountry) : null,
        source: "thesportsdb",
      })),
    })

    await tx.footballMeta.upsert({
      where: { key: metaKey },
      update: { value: hash },
      create: { key: metaKey, value: hash },
    })
  })

  console.log(`✅ Updated leagues. Count=${leagues.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

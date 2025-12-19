const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding DEV database...")

  const admin = await prisma.user.upsert({
    where: { email: "admin@dev.local" },
    update: {},
    create: {
      email: "admin@dev.local",
      name: "Dev Admin",
      role: "ADMIN",
    },
  })

  console.log("✅ Seed complete")
  console.log(`   Admin user: ${admin.email}`)
}

main()
  .catch((e) => {
    console.error("❌ Seed failed")
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

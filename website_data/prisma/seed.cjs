const { PrismaClient, Role } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  const adminHash = await bcrypt.hash("admin123", 10)
  const userHash = await bcrypt.hash("user123", 10)

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {
      name: "Admin User",
      role: Role.ADMIN,
      passwordHash: adminHash,
    },
    create: {
      email: "admin@example.com",
      name: "Admin User",
      role: Role.ADMIN,
      passwordHash: adminHash,
    },
  })

  await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {
      name: "Standard User",
      role: Role.USER,
      passwordHash: userHash,
    },
    create: {
      email: "user@example.com",
      name: "Standard User",
      role: Role.USER,
      passwordHash: userHash,
    },
  })

  console.log("✅ Seeded admin and standard user")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

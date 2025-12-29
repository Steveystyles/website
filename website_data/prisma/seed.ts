import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const adminPasswordHash = await bcrypt.hash("admin123", 10)
  const userPasswordHash = await bcrypt.hash("user123", 10)

  // Admin user
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {
      name: "Admin User",
      role: Role.ADMIN,
      passwordHash: adminPasswordHash,
    },
    create: {
      email: "admin@example.com",
      name: "Admin User",
      role: Role.ADMIN,
      passwordHash: adminPasswordHash,
    },
  })

  // Standard user
  await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {
      name: "Standard User",
      role: Role.USER,
      passwordHash: userPasswordHash,
    },
    create: {
      email: "user@example.com",
      name: "Standard User",
      role: Role.USER,
      passwordHash: userPasswordHash,
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

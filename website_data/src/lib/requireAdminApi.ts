import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/auth/auth"

export async function requireAdmin() {
  const session = await getServerSession(authOptions)

  // ❌ Not logged in → login
  if (!session?.user) {
    redirect("/login")
  }

  // ❌ Logged in but not admin → home
  if (session.user.role !== "ADMIN") {
    redirect("/")
  }

  // ✅ Admin
  return session
}

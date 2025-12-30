import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/auth/auth"
import DashboardClient from "@/components/dashboard/DashboardClient"
import { loadSoccerIndex } from "@/lib/data/soccerIndex"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  const soccerIndex = await loadSoccerIndex()

  return <DashboardClient soccerIndex={soccerIndex} />
}

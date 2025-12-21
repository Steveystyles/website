import { getServerSession } from "next-auth"
import { authOptions } from "@/auth/auth"
import { redirect } from "next/navigation"
import HomePage from "@/components/home/HomePage"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return <HomePage userEmail={session.user?.email ?? "User"} />
}

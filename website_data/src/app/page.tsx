import { getServerSession } from "next-auth"
import { authOptions } from "@/auth/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <main>
      <h1>Welcome {session.user?.email}</h1>
    </main>
  )
}

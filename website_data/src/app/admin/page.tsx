import { getServerSession } from "next-auth"
import { authOptions } from "@/auth/auth"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {session!.user.email}</p>
    </div>
  )
}

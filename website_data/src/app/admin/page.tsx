import { requireAdmin } from "@/lib/requireAdmin"
import { LogoutButton } from "@/components/LogoutButton"

export default async function AdminPage() {
  const session = await requireAdmin()

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {session.user.email}</p>

      <LogoutButton />
    </div>
  )
}

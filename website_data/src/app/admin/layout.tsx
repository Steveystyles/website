import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth/auth"

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <div style={{ padding: 24 }}>
      <nav style={{ marginBottom: 16 }}>
        <strong>Admin</strong> ·{" "}
        <a href="/admin">Dashboard</a> ·{" "}
        <a href="/admin/users">Users</a>
      </nav>

      {children}
    </div>
  )
}

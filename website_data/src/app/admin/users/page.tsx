import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/requireAdmin"
import bcrypt from "bcryptjs"
import { LogoutButton } from "@/components/LogoutButton"

export default async function AdminUsersPage() {
  // 🔐 Ensure admin access
  await requireAdmin()

  // 📦 Fetch users
  const users = await prisma.user.findMany({
    orderBy: { email: "asc" },
    select: {
      id: true,
      email: true,
      role: true,
    },
  })

  // 🧾 Server Action: create user
  async function createUser(formData: FormData) {
    "use server"

    const email = formData.get("email")?.toString()
    const password = formData.get("password")?.toString()
    const role = formData.get("role") as "USER" | "ADMIN"

    if (!email || !password) {
      throw new Error("Email and password are required")
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        email,
        role,
        passwordHash,
      },
    })
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin – Users</h1>

      {/* ➕ Create User */}
      <form action={createUser} style={{ marginBottom: "2rem" }}>
        <h2>Create User</h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
        />

        <select name="role" defaultValue="USER">
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        <button type="submit">Create</button>
      </form>

      {/* 📋 Users list */}
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <LogoutButton />
    </div>
  )
}

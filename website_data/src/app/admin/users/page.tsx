"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";


export async function createUser(formData: FormData) {
  const session = await requireAdmin();

  const email = formData.get("email") as string;
  const name = formData.get("name") as string | null;
  const role = formData.get("role") as "USER" | "ADMIN";
  const password = formData.get("password") as string;

  if (!email || !password || !role) {
    throw new Error("Missing required fields");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      name,
      role,
      passwordHash,
    },
  });

  revalidatePath("/admin/users");
}
export async function deleteUser(formData: FormData) {
  const session = await requireAdmin();

  const userId = formData.get("userId") as string;
  const confirmed = formData.get("confirm") === "on";

  if (!userId) {
    throw new Error("Missing user ID");
  }

  // Prevent self-deletion
  if (session.user.id === userId) {
    throw new Error("You cannot delete your own account");
  }

  // Require explicit confirmation
  if (!confirmed) {
    return; // silently do nothing
  }

  // Prevent deleting the last admin
  const adminCount = await prisma.user.count({
    where: { role: "ADMIN" },
  });

  const target = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (target?.role === "ADMIN" && adminCount <= 1) {
    throw new Error("Cannot delete the last admin");
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath("/admin/users");
}

export async function updateUserRole(formData: FormData) {
  const userId = formData.get("userId") as string;
  const role = formData.get("role") as "USER" | "ADMIN";

  if (!userId || !role) {
    throw new Error("Invalid form submission");
  }

  const session = await requireAdmin();

  if (session.user.id === userId) {
    throw new Error("You cannot change your own role");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  // 🔥 THIS is the key line
  revalidatePath("/admin/users");
}

export async function resetUserPassword(formData: FormData) {
  const session = await requireAdmin();

  const userId = formData.get("userId") as string;
  const newPassword = formData.get("password") as string;

  if (!userId || !newPassword) {
    throw new Error("Missing password reset data");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  revalidatePath("/admin/users");
}

/**
 * Page Component (Server Component)
 * Renders the UI
 */
export default async function AdminUsersPage() {
  // Extra safety — layout already enforces admin
  const session = await requireAdmin();

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
    orderBy: { email: "asc" },
  });

  return (
    <>
      <h1>User Management</h1>
      <p style={{ color: "#6b7280", marginBottom: 16 }}>
        Manage user roles. Changes take effect immediately.
      </p>
      <section style={{ marginBottom: 24 }}>
        <h3>Add User</h3>

        <form action={createUser} style={{ display: "flex", gap: 8 }}>
          <input
            name="email"
            placeholder="Email"
            required
          />
          <input
            name="name"
            placeholder="Name"
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

          <button type="submit">Add User</button>
        </form>
      </section>

      <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: 16,
      }}
      >
        <thead>
          <tr>
            <th align="left">User</th>
            <th align="left">Role</th>
            <th align="right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN";
            return (
              <tr
                key={user.id}
                style={{ borderBottom: "1px solid #e5e7eb" }}
              >
                <td>
                  <div style={{ fontWeight: 500 }}>{user.email}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    {user.name ?? "—"}
                  </div>
                </td>

                <td>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      backgroundColor:
                        user.role === "ADMIN" ? "#fee2e2" : "#e0f2fe",
                      color:
                        user.role === "ADMIN" ? "#991b1b" : "#075985",
                    }}
                  >
                    {user.role}
                  </span>
                </td>
                <td align="right">
                  <details style={{ position: "relative", display: "inline-block" }}>
                    <summary
                      style={{
                        cursor: "pointer",
                        listStyle: "none",
                        padding: "6px 10px",
                        border: "1px solid #d1d5db",
                        borderRadius: 6,
                        background: "#f9fafb",
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      Actions ▾
                    </summary>

                    {/* Dropdown content */}
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        marginTop: 6,
                        minWidth: 220,
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 8,
                        padding: 12,
                        boxShadow:
                          "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                        zIndex: 10,
                      }}
                    >
                      {/* Promote / Demote */}
                      <form action={updateUserRole} style={{ marginBottom: 8 }}>
                        <input type="hidden" name="userId" value={user.id} />
                        <input type="hidden" name="role" value={nextRole} />

                        <button
                          type="submit"
                          disabled={session.user.id === user.id}
                          style={{
                            width: "100%",
                            padding: "6px 8px",
                            textAlign: "left",
                            borderRadius: 6,
                            border: "none",
                            background: "transparent",
                            cursor:
                              session.user.id === user.id ? "not-allowed" : "pointer",
                            color:
                              session.user.id === user.id ? "#9ca3af" : "#111827",
                          }}
                        >
                          {user.role === "ADMIN"
                            ? "Demote to USER"
                            : "Promote to ADMIN"}
                        </button>
                      </form>

                      <hr style={{ margin: "8px 0" }} />

                      {/* Reset password */}
                      <form action={resetUserPassword} style={{ marginBottom: 8 }}>
                        <input type="hidden" name="userId" value={user.id} />
                        <input
                          type="password"
                          name="password"
                          placeholder="New password"
                          required
                          style={{ width: "100%", marginBottom: 6 }}
                        />
                        <button type="submit" style={{ width: "100%" }}>
                          Reset password
                        </button>
                      </form>

                      <hr style={{ margin: "8px 0" }} />

                      {/* Delete */}
                      <form action={deleteUser}>
                        <input type="hidden" name="userId" value={user.id} />
                        <label style={{ fontSize: 12 }}>
                          <input type="checkbox" name="confirm" /> confirm delete
                        </label>
                        <button
                          type="submit"
                          disabled={session.user.id === user.id}
                          style={{
                            marginTop: 6,
                            width: "100%",
                            color: "#b91c1c",
                            cursor:
                              session.user.id === user.id ? "not-allowed" : "pointer",
                          }}
                        >
                          Delete user
                        </button>
                      </form>
                    </div>
                  </details>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

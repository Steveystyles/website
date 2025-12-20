import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/requireAdminApi";

export async function GET() {
  // Enforce admin access
  const session = await requireAdminApi();
  if (session instanceof Response) {
    return session;
  }

  // Fetch users (minimal, safe fields only)
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
    orderBy: {
      email: "asc",
    },
  });

  return Response.json(users);
}

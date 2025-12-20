import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/requireAdminApi";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdminApi();
  if (session instanceof Response) return session;

  const body = await req.json();
  const { role } = body as { role: "USER" | "ADMIN" };

  if (!role || !["USER", "ADMIN"].includes(role)) {
    return new Response("Invalid role", { status: 400 });
  }

  // Prevent admin from demoting themselves
  if (params.id === session.user.id) {
    return new Response("Cannot change your own role", { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data: { role },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  return Response.json(user);
}

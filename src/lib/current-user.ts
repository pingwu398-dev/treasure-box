import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/lib/roles";

export async function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, username: true, role: true, keyBalance: true },
  });
  if (!user) return null;
  return { ...user, role: user.role as Role };
}

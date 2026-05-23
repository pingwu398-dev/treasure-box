import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/lib/roles";

export async function GET() {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ ok: false }, { status: 401 });
  if (me.role !== ROLE.ADMIN) return NextResponse.json({ ok: false }, { status: 403 });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      username: true,
      role: true,
      keyBalance: true,
      createdAt: true,
      _count: { select: { sBoxes: true } },
    },
  });

  const mapped = users.map((u) => ({
    id: u.id,
    username: u.username,
    role: u.role,
    keyBalance: u.keyBalance,
    createdAt: u.createdAt.toISOString(),
    boxCount: u._count.sBoxes,
  }));

  return NextResponse.json({ ok: true, users: mapped });
}


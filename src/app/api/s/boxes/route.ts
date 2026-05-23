import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/lib/roles";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  if (user.role !== ROLE.S) return NextResponse.json({ ok: false }, { status: 403 });

  const boxes = await prisma.treasureBox.findMany({
    where: { ownerSUserId: user.id },
    orderBy: { createdAt: "asc" },
    select: { id: true, status: true, contentText: true, openedAt: true },
  });

  return NextResponse.json({ ok: true, boxes });
}


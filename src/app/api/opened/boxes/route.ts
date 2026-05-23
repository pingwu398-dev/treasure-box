import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ ok: false }, { status: 401 });

  const boxes = await prisma.treasureBox.findMany({
    where: { status: "OPENED" },
    orderBy: { openedAt: "desc" },
    take: 100,
    select: {
      id: true,
      openedAt: true,
      ownerSUser: { select: { id: true, username: true } },
      openedByMUser: { select: { id: true, username: true } },
    },
  });

  return NextResponse.json({ ok: true, boxes });
}


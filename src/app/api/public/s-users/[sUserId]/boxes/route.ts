import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, ctx: { params: { sUserId: string } }) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ ok: false }, { status: 401 });

  const boxes = await prisma.treasureBox.findMany({
    where: {
      ownerSUserId: ctx.params.sUserId,
      status: "READY",
      contentText: { not: null },
    },
    orderBy: { createdAt: "asc" },
    select: { id: true, createdAt: true },
  });

  return NextResponse.json({ ok: true, boxes });
}


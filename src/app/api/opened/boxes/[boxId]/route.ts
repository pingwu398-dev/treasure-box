import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, ctx: { params: { boxId: string } }) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ ok: false }, { status: 401 });

  const box = await prisma.treasureBox.findUnique({
    where: { id: ctx.params.boxId },
    select: {
      id: true,
      status: true,
      openedAt: true,
      contentSnapshotAtOpen: true,
      ownerSUser: { select: { id: true, username: true } },
      openedByMUser: { select: { id: true, username: true } },
    },
  });
  if (!box || box.status !== "OPENED") return NextResponse.json({ ok: false }, { status: 404 });

  return NextResponse.json({ ok: true, box });
}


import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ ok: false }, { status: 401 });

  const url = new URL(req.url);
  const ownerUsername = (url.searchParams.get("ownerUsername") ?? "").trim();
  const openerUsername = (url.searchParams.get("openerUsername") ?? "").trim();

  const where: any = { status: { in: ["OPENED", "REDEEMED"] } };

  if (ownerUsername) {
    const ownerUsers = await prisma.user.findMany({
      where: { role: "S", username: { contains: ownerUsername } },
      select: { id: true },
    });
    where.ownerSUserId = { in: ownerUsers.map((u) => u.id) };
  }

  if (openerUsername) {
    const openerUsers = await prisma.user.findMany({
      where: { role: "M", username: { contains: openerUsername } },
      select: { id: true },
    });
    where.openedByMUserId = { in: openerUsers.map((u) => u.id) };
  }

  const boxes = await prisma.treasureBox.findMany({
    where,
    orderBy: { openedAt: "desc" },
    take: 100,
    select: {
      id: true, status: true, openedAt: true, contentSnapshotAtOpen: true,
      ownerSUser: { select: { username: true } },
      openedByMUser: { select: { username: true } },
    },
  });

  return NextResponse.json({ ok: true, boxes });
}

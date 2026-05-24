import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/lib/roles";

export async function GET(req: Request) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ ok: false }, { status: 401 });

  const url = new URL(req.url);
  const type = url.searchParams.get("type");

  if (type === "M") {
    const users = await prisma.user.findMany({
      where: { role: ROLE.M },
      orderBy: { totalKeysEarned: "desc" },
      take: 10,
      select: { id: true, username: true, totalKeysEarned: true },
    });
    const list = users.map((u) => ({
      id: u.id,
      username: u.username,
      cumulativeKeys: u.totalKeysEarned,
    }));
    return NextResponse.json({ ok: true, list, type: "M" });
  }

  if (type === "S") {
    const users = await prisma.user.findMany({
      where: { role: ROLE.S },
      orderBy: { sBoxes: { _count: "desc" } },
      take: 10,
      select: {
        id: true,
        username: true,
        _count: { select: { sBoxes: true } },
      },
    });
    const list = users.map((u) => ({
      id: u.id,
      username: u.username,
      boxCount: u._count.sBoxes,
    }));
    return NextResponse.json({ ok: true, list, type: "S" });
  }

  return NextResponse.json({ ok: false, error: "missing type" }, { status: 400 });
}

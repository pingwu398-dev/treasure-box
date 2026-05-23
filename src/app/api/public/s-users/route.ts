import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/lib/roles";

export async function GET(req: Request) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ ok: false }, { status: 401 });

  const url = new URL(req.url);
  const query = (url.searchParams.get("query") ?? "").trim();

  const users = await prisma.user.findMany({
    where: {
      role: ROLE.S,
      username: query ? { contains: query } : undefined,
    },
    orderBy: { username: "asc" },
    take: 50,
    select: { id: true, username: true },
  });

  return NextResponse.json({ ok: true, users });
}


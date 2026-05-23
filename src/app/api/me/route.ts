import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, username: true, role: true, keyBalance: true },
  });
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  return NextResponse.json({ ok: true, user });
}

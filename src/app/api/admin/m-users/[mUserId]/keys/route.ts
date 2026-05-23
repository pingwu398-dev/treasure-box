import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/lib/roles";
import { auditLog } from "@/lib/audit";

const BodySchema = z.object({ delta: z.coerce.number().int().min(-100000).max(100000) });

export async function POST(req: Request, ctx: { params: { mUserId: string } }) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ ok: false }, { status: 401 });
  if (me.role !== ROLE.ADMIN) return NextResponse.json({ ok: false }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "参数不合法" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { id: ctx.params.mUserId },
    select: { id: true, role: true, keyBalance: true },
  });
  if (!user || user.role !== ROLE.M) return NextResponse.json({ ok: false, error: "目标用户不是M" }, { status: 409 });

  const nextBalance = Math.max(0, user.keyBalance + parsed.data.delta);
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { keyBalance: nextBalance },
    select: { id: true, keyBalance: true },
  });

  await auditLog({
    actorUserId: me.id,
    action: "ASSIGN_KEYS",
    targetType: "USER",
    targetId: user.id,
    payload: { delta: parsed.data.delta, nextBalance },
  });

  return NextResponse.json({ ok: true, user: updated });
}


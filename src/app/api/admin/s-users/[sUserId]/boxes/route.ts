import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/lib/roles";
import { auditLog } from "@/lib/audit";

const BodySchema = z.object({ count: z.coerce.number().int().min(1).max(1000) });

export async function GET(_req: Request, ctx: { params: { sUserId: string } }) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ ok: false }, { status: 401 });
  if (me.role !== ROLE.ADMIN) return NextResponse.json({ ok: false }, { status: 403 });

  const boxes = await prisma.treasureBox.findMany({
    where: { ownerSUserId: ctx.params.sUserId },
    orderBy: { createdAt: "asc" },
    select: { id: true, status: true, contentText: true, openedAt: true, createdAt: true },
  });

  return NextResponse.json({ ok: true, boxes });
}

export async function POST(req: Request, ctx: { params: { sUserId: string } }) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ ok: false }, { status: 401 });
  if (me.role !== ROLE.ADMIN) return NextResponse.json({ ok: false }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "参数不合法" }, { status: 400 });

  const sUser = await prisma.user.findUnique({ where: { id: ctx.params.sUserId }, select: { id: true, role: true } });
  if (!sUser || sUser.role !== ROLE.S) return NextResponse.json({ ok: false, error: "目标用户不是S" }, { status: 409 });

  const data = Array.from({ length: parsed.data.count }).map(() => ({
    ownerSUserId: ctx.params.sUserId,
    status: "DRAFT" as const,
  }));
  await prisma.treasureBox.createMany({ data });

  await auditLog({
    actorUserId: me.id,
    action: "ASSIGN_BOXES",
    targetType: "USER",
    targetId: ctx.params.sUserId,
    payload: { count: parsed.data.count },
  });

  return NextResponse.json({ ok: true });
}

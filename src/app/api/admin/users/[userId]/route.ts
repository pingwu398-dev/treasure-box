import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/lib/roles";
import { hashPassword } from "@/lib/password";
import { auditLog } from "@/lib/audit";

const PatchSchema = z.object({
  role: z.enum([ROLE.S, ROLE.M, ROLE.ADMIN]).optional(),
  password: z.string().min(6).max(72).optional(),
});

export async function PATCH(req: Request, ctx: { params: { userId: string } }) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ ok: false }, { status: 401 });
  if (me.role !== ROLE.ADMIN) return NextResponse.json({ ok: false }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "参数不合法" }, { status: 400 });

  const data: any = {};
  if (parsed.data.role) {
    data.role = parsed.data.role;
    if (parsed.data.role !== ROLE.M) data.keyBalance = 0;
  }
  if (parsed.data.password) data.passwordHash = await hashPassword(parsed.data.password);

  const updated = await prisma.user.update({
    where: { id: ctx.params.userId },
    data,
    select: { id: true, username: true, role: true, keyBalance: true },
  });

  await auditLog({
    actorUserId: me.id,
    action: "ADMIN_UPDATE_USER",
    targetType: "USER",
    targetId: updated.id,
    payload: parsed.data,
  });

  return NextResponse.json({ ok: true, user: updated });
}

export async function DELETE(_req: Request, ctx: { params: { userId: string } }) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ ok: false }, { status: 401 });
  if (me.role !== ROLE.ADMIN) return NextResponse.json({ ok: false }, { status: 403 });
  if (ctx.params.userId === me.id) return NextResponse.json({ ok: false, error: "不能删除自己" }, { status: 409 });

  await prisma.user.delete({ where: { id: ctx.params.userId } });

  await auditLog({
    actorUserId: me.id,
    action: "ADMIN_DELETE_USER",
    targetType: "USER",
    targetId: ctx.params.userId,
  });

  return NextResponse.json({ ok: true });
}


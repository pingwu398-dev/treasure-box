import { NextResponse } from "next/server";
import { LoginSchema } from "@/lib/zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { setSession } from "@/lib/session";
import { auditLog } from "@/lib/audit";
import type { Role } from "@/lib/roles";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "参数不合法" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { username: parsed.data.username },
    select: { id: true, username: true, passwordHash: true, role: true },
  });
  if (!user) return NextResponse.json({ ok: false, error: "用户名或密码错误" }, { status: 401 });

  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) return NextResponse.json({ ok: false, error: "用户名或密码错误" }, { status: 401 });

  const role = user.role as Role;
  setSession({ id: user.id, role });

  await auditLog({
    actorUserId: user.id,
    action: "LOGIN",
    targetType: "USER",
    targetId: user.id,
  });

  return NextResponse.json({ ok: true, user: { id: user.id, username: user.username, role } });
}

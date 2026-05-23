import { NextResponse } from "next/server";
import { RegisterSchema } from "@/lib/zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { auditLog } from "@/lib/audit";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = RegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "参数不合法" }, { status: 400 });
  }

  try {
    const user = await prisma.user.create({
      data: {
        username: parsed.data.username,
        passwordHash: await hashPassword(parsed.data.password),
        role: parsed.data.role,
        keyBalance: 0,
      },
      select: { id: true, username: true, role: true },
    });

    await auditLog({
      actorUserId: user.id,
      action: "REGISTER",
      targetType: "USER",
      targetId: user.id,
      payload: { username: user.username, role: user.role },
    });

    return NextResponse.json({ ok: true, user });
  } catch (e: any) {
    if (e?.code === "P2002") {
      return NextResponse.json({ ok: false, error: "用户名已存在" }, { status: 409 });
    }
    return NextResponse.json({ ok: false, error: "服务器错误" }, { status: 500 });
  }
}

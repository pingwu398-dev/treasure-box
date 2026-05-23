import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export async function GET() {
  const username = (process.env.SEED_ADMIN_USERNAME || "admin").trim();
  const password = (process.env.SEED_ADMIN_PASSWORD || "admin12345").trim();

  let action = "";
  try {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      await prisma.user.update({
        where: { username },
        data: { passwordHash: await hashPassword(password) },
      });
      action = "已重置";
    } else {
      await prisma.user.create({
        data: {
          username,
          passwordHash: await hashPassword(password),
          role: "ADMIN",
          keyBalance: 0,
        },
      });
      action = "已创建";
    }
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) });
  }

  const users = await prisma.user.findMany({
    select: { id: true, username: true, role: true },
  });

  return NextResponse.json({
    ok: true,
    action: `管理员 ${action}`,
    totalUsers: users.length,
    users,
  });
}

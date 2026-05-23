import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export async function GET() {
  const username = process.env.SEED_ADMIN_USERNAME || "admin";
  const password = process.env.SEED_ADMIN_PASSWORD || "admin12345";

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return NextResponse.json({ ok: true, message: "管理员已存在" });
  }

  await prisma.user.create({
    data: {
      username,
      passwordHash: await hashPassword(password),
      role: "ADMIN",
      keyBalance: 0,
    },
  });

  return NextResponse.json({ ok: true, message: `管理员 ${username} 创建成功` });
}

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/lib/roles";

export async function POST(req: Request, props: { params: { boxId: string } }) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ ok: false, error: "未登录" }, { status: 401 });
  if (me.role !== ROLE.S) return NextResponse.json({ ok: false, error: "仅 S 可兑现" }, { status: 403 });

  const box = await prisma.treasureBox.findUnique({
    where: { id: props.params.boxId },
    select: { id: true, ownerSUserId: true, status: true },
  });
  if (!box) return NextResponse.json({ ok: false, error: "宝箱不存在" }, { status: 404 });
  if (box.ownerSUserId !== me.id) return NextResponse.json({ ok: false, error: "无权操作" }, { status: 403 });
  if (box.status !== "OPENED") return NextResponse.json({ ok: false, error: "仅已开启的宝箱可兑现" }, { status: 400 });

  await prisma.treasureBox.update({
    where: { id: box.id },
    data: { status: "REDEEMED" },
  });

  return NextResponse.json({ ok: true });
}

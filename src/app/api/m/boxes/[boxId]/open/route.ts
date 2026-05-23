import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { ROLE } from "@/lib/roles";

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function POST(_req: Request, ctx: { params: { boxId: string } }) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ ok: false }, { status: 401 });
  if (me.role !== ROLE.M) return NextResponse.json({ ok: false }, { status: 403 });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const box = await tx.treasureBox.findUnique({
        where: { id: ctx.params.boxId },
        select: { id: true, status: true, contentText: true, ownerSUserId: true },
      });
      if (!box) throw new HttpError(404, "宝箱不存在");
      if (box.status === "OPENED") throw new HttpError(409, "宝箱已被打开");
      if (!box.contentText) throw new HttpError(409, "宝箱内容未填写");

      const dec = await tx.user.updateMany({
        where: { id: me.id, role: ROLE.M, keyBalance: { gt: 0 } },
        data: { keyBalance: { decrement: 1 } },
      });
      if (dec.count !== 1) throw new HttpError(409, "钥匙不足");

      const openedAt = new Date();
      const opened = await tx.treasureBox.updateMany({
        where: { id: box.id, status: { not: "OPENED" } },
        data: {
          status: "OPENED",
          openedByMUserId: me.id,
          openedAt,
          contentSnapshotAtOpen: box.contentText,
        },
      });
      if (opened.count !== 1) throw new HttpError(409, "宝箱已被打开");

      await tx.auditLog.create({
        data: {
          actorUserId: me.id,
          action: "OPEN_BOX",
          targetType: "BOX",
          targetId: box.id,
          payload: { ownerSUserId: box.ownerSUserId },
        },
      });

      return { boxId: box.id, contentText: box.contentText, openedAt };
    });

    return NextResponse.json({ ok: true, result });
  } catch (e: any) {
    if (e instanceof HttpError) {
      return NextResponse.json({ ok: false, error: e.message }, { status: e.status });
    }
    return NextResponse.json({ ok: false, error: "服务器错误" }, { status: 500 });
  }
}

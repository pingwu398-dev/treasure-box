import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/lib/roles";
import { BoxContentSchema } from "@/lib/zod";
import { auditLog } from "@/lib/audit";

export async function PUT(req: Request, ctx: { params: { boxId: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  if (user.role !== ROLE.S) return NextResponse.json({ ok: false }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = BoxContentSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "参数不合法" }, { status: 400 });

  const box = await prisma.treasureBox.findUnique({ where: { id: ctx.params.boxId } });
  if (!box || box.ownerSUserId !== user.id) return NextResponse.json({ ok: false }, { status: 404 });
  if (box.status === "OPENED") return NextResponse.json({ ok: false, error: "宝箱已开，无法修改" }, { status: 409 });

  const updated = await prisma.treasureBox.update({
    where: { id: box.id },
    data: {
      contentText: parsed.data.contentText,
      status: "READY",
    },
    select: { id: true, status: true, contentText: true },
  });

  await auditLog({
    actorUserId: user.id,
    action: "EDIT_BOX",
    targetType: "BOX",
    targetId: box.id,
    payload: { by: "S" },
  });

  return NextResponse.json({ ok: true, box: updated });
}


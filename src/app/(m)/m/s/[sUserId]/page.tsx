import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { OpenBoxList } from "@/components/OpenBoxList";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/lib/roles";

export default async function SBoxListPage(props: { params: { sUserId: string } }) {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (me.role !== ROLE.M) redirect("/");

  const sUser = await prisma.user.findUnique({
    where: { id: props.params.sUserId },
    select: { id: true, username: true, role: true },
  });
  if (!sUser || sUser.role !== ROLE.S) redirect("/m");

  const boxes = await prisma.treasureBox.findMany({
    where: { ownerSUserId: sUser.id, status: "READY", contentText: { not: null } },
    orderBy: { createdAt: "asc" },
    select: { id: true, createdAt: true },
  });

  return (
    <div className="min-h-full">
      <AppHeader role={me.role} username={me.username} />
      <main className="mx-auto max-w-4xl p-4 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold">{sUser.username} 的宝箱</h1>
          <Link className="text-sm underline" href="/m">
            返回
          </Link>
        </div>
        {boxes.length === 0 ? (
          <p className="text-sm text-zinc-600">暂无可开的宝箱（可能还未填写或已被别人打开）。</p>
        ) : (
          <OpenBoxList
            boxes={boxes.map((b) => ({ id: b.id, createdAt: b.createdAt.toISOString() }))}
          />
        )}
      </main>
    </div>
  );
}


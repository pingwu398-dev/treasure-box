import Link from "next/link";
import { redirect } from "next/navigation";
import { OpenBoxList } from "@/components/OpenBoxList";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { AppHeader } from "@/components/AppHeader";
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
    <div className="min-h-screen pb-4">
      <AppHeader role={me.role} username={me.username} title={`${sUser.username} 的宝箱`} />
      <main className="mx-auto max-w-lg px-5 py-5">
        <Link href="/m" className="inline-flex items-center text-lg text-stone-500 mb-5">← 返回</Link>
        {boxes.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm border border-stone-200/60">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-lg font-medium text-stone-700">暂无可开的宝箱</p>
            <p className="mt-2 text-base text-stone-500">可能还未填写或已被打开</p>
          </div>
        ) : (
          <OpenBoxList boxes={boxes.map((b) => ({ id: b.id, createdAt: b.createdAt.toISOString() }))} />
        )}
      </main>
    </div>
  );
}

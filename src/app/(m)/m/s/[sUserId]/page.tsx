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
    <div className="min-h-screen bg-[var(--bg)] pb-8">
      <AppHeader role={me.role} username={me.username} title={`${sUser.username} 的宝箱`} />
      <main className="mx-auto max-w-lg px-4 py-5">
        <Link href="/m" className="inline-flex items-center text-sm text-[var(--text-muted)] mb-4 transition hover:text-[var(--text)]">
          ← 返回
        </Link>
        {boxes.length === 0 ? (
          <div className="flex flex-col items-center rounded-xl bg-white px-6 py-14 text-center shadow-sm border border-[var(--border-light)]">
            <div className="mb-3 text-5xl">📦</div>
            <p className="text-base font-bold text-[var(--text)]">暂无可开的宝箱</p>
            <p className="mt-1 text-xs text-[var(--text-light)]">可能还未填写或已被打开</p>
          </div>
        ) : (
          <OpenBoxList boxes={boxes.map((b) => ({ id: b.id, createdAt: b.createdAt.toISOString() }))} />
        )}
      </main>
    </div>
  );
}

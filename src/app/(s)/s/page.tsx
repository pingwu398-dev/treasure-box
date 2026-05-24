import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { AppHeader } from "@/components/AppHeader";
import { ROLE } from "@/lib/roles";

export default async function SHomePage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (me.role !== ROLE.S) redirect("/");

  const boxes = await prisma.treasureBox.findMany({
    where: { ownerSUserId: me.id },
    orderBy: { createdAt: "asc" },
    select: {
      id: true, status: true, contentText: true, contentSnapshotAtOpen: true,
      openedByMUser: { select: { username: true } },
    },
  });

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-8">
      <AppHeader role={me.role} username={me.username} title="我的宝箱" />
      <main className="mx-auto max-w-lg px-5 py-6">
        <div className="mb-7 flex items-center justify-between">
          <span className="text-sm font-semibold text-[var(--text-muted)]">
            共 <span className="text-base text-[var(--text)]">{boxes.length}</span> 个宝箱
          </span>
        </div>

        <div className="space-y-5">
          {boxes.length === 0 && (
            <div className="flex flex-col items-center rounded-3xl bg-white px-6 py-16 text-center shadow-sm border border-[var(--border-light)] stagger-1 animate-fade-up">
              <div className="mb-4 text-6xl animate-float">📭</div>
              <p className="text-lg font-bold text-[var(--text)]">暂无宝箱</p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">请联系管理员分配</p>
            </div>
          )}

          {boxes.map((b, idx) => {
            const content = b.status === "OPENED" ? b.contentSnapshotAtOpen : b.contentText;
            const hasContent = content && content.trim().length > 0;
            return (
              <div key={b.id} className={`rounded-2xl bg-white p-5 shadow-sm border border-[var(--border-light)] animate-fade-up stagger-${Math.min(idx + 1, 6)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg font-bold text-[var(--text)]">宝箱{idx + 1}</span>
                    <span className={`badge ${b.status === "OPENED" ? "bg-slate-100 text-slate-600" : b.status === "READY" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-600"}`}>
                      {b.status === "OPENED" ? "已开启" : b.status === "READY" ? "待开启" : "未填写"}
                    </span>
                    {b.status === "OPENED" && b.openedByMUser?.username && (
                      <span className="text-sm text-[var(--text-muted)]">· {b.openedByMUser.username}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {b.status !== "OPENED" && (
                      <Link href={`/s/boxes/${b.id}`} className="btn-gold rounded-xl px-5 py-2.5 text-sm">编辑</Link>
                    )}
                    {b.status === "OPENED" && (
                      <Link href={`/opened/${b.id}`} className="btn-gold rounded-xl px-5 py-2.5 text-sm">查看</Link>
                    )}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[var(--border-light)]">
                  <span className="text-sm text-[var(--text-muted)]">
                    {hasContent ? content : "无内容"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

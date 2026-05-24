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

  const todoCount = boxes.filter((b) => b.status !== "OPENED").length;

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-8">
      <AppHeader role={me.role} username={me.username} title="我的宝箱" />
      <main className="mx-auto max-w-lg px-4 py-5">
        {/* Summary bar */}
        <div className="mb-5 flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm border border-[var(--border-light)]">
          <span className="text-xs text-[var(--text-muted)]">共 <strong className="text-[var(--text)]">{boxes.length}</strong> 个宝箱</span>
          <span className="mx-1.5 text-[var(--text-faint)]">·</span>
          <span className="text-xs text-[var(--text-muted)]">
            待处理 <strong className="text-[var(--amber)]">{todoCount}</strong>
          </span>
        </div>

        {/* Empty state */}
        {boxes.length === 0 && (
          <div className="flex flex-col items-center rounded-xl bg-white px-6 py-14 text-center shadow-sm border border-[var(--border-light)]">
            <div className="mb-3 text-5xl">📭</div>
            <p className="text-base font-bold text-[var(--text)]">暂无宝箱</p>
            <p className="mt-1 text-xs text-[var(--text-light)]">请联系管理员分配宝箱</p>
          </div>
        )}

        {/* Box list */}
        <div className="space-y-3">
          {boxes.map((b, idx) => {
            const content = b.status === "OPENED" ? b.contentSnapshotAtOpen : b.contentText;
            const hasContent = content && content.trim().length > 0;

            return (
              <div key={b.id} className={`rounded-xl bg-white p-4 shadow-sm border border-[var(--border-light)] animate-fade-up stagger-${Math.min(idx + 1, 6)}`}>
                {/* Row 1: status + action */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-bold text-[var(--text)] shrink-0">宝箱{idx + 1}</span>
                    <span className={`badge ${
                      b.status === "OPENED" ? "status-open" :
                      b.status === "READY" ? "status-ready" : "status-draft"
                    }`}>
                      {b.status === "OPENED" ? "已开启" :
                       b.status === "READY" ? "待开启" : "未填写"}
                    </span>
                    {b.status === "OPENED" && b.openedByMUser?.username && (
                      <span className="text-[11px] text-[var(--text-light)] truncate">· {b.openedByMUser.username}</span>
                    )}
                  </div>
                  <div className="shrink-0 ml-2">
                    {b.status !== "OPENED" ? (
                      <Link href={`/s/boxes/${b.id}`} className="btn btn-primary touch-btn rounded-xl px-4 py-2 text-xs">编辑</Link>
                    ) : (
                      <Link href={`/opened/${b.id}`} className="btn btn-secondary touch-btn rounded-xl px-4 py-2 text-xs">查看</Link>
                    )}
                  </div>
                </div>
                {/* Row 2: content preview */}
                <div className="mt-2.5 pt-2.5 border-t border-[var(--border-light)]">
                  <span className="text-xs text-[var(--text-light)] leading-relaxed line-clamp-2">
                    {hasContent ? content : "—"}
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

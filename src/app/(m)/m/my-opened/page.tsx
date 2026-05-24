import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { AppHeader } from "@/components/AppHeader";
import { LocalTime } from "@/components/LocalTime";
import { ROLE } from "@/lib/roles";

export default async function MyOpenedPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (me.role !== ROLE.M) redirect("/");

  const boxes = await prisma.treasureBox.findMany({
    where: { openedByMUserId: me.id, status: "OPENED" },
    orderBy: { openedAt: "desc" },
    take: 100,
    select: {
      id: true, openedAt: true, contentSnapshotAtOpen: true,
      ownerSUser: { select: { username: true } },
    },
  });

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-8">
      <AppHeader role={me.role} username={me.username} title="已开记录" />
      <main className="mx-auto max-w-lg px-4 py-5 space-y-3">
        {boxes.length === 0 && (
          <div className="flex flex-col items-center rounded-xl bg-white px-6 py-14 text-center shadow-sm border border-[var(--border-light)]">
            <div className="mb-3 text-5xl">📭</div>
            <p className="text-sm font-bold text-[var(--text)]">暂未开启任何宝箱</p>
            <p className="mt-1 text-xs text-[var(--text-light)]">快去开第一个吧！</p>
          </div>
        )}
        {boxes.map((b, i) => (
          <Link key={b.id} href={`/opened/${b.id}`} className={`block rounded-xl bg-white p-4 shadow-sm border border-[var(--border-light)] transition hover:shadow-md active:scale-[0.99] animate-fade-up stagger-${Math.min(i + 1, 6)}`}>
            <div className="flex items-center gap-2 text-[11px] text-[var(--text-light)]">
              <span>📦 {b.ownerSUser?.username ?? "-"}</span>
              <span>·</span>
              <span>🕒 {b.openedAt ? <LocalTime date={b.openedAt.toISOString()} /> : "-"}</span>
            </div>
            <div className="mt-2 text-sm leading-relaxed text-[var(--text)] line-clamp-3">
              {b.contentSnapshotAtOpen ?? ""}
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}

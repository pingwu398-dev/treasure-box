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
      <AppHeader role={me.role} username={me.username} title="本人已开" />
      <main className="mx-auto max-w-lg px-5 py-6 space-y-4">
        {boxes.length === 0 && (
          <div className="flex flex-col items-center rounded-3xl bg-white px-6 py-16 text-center shadow-sm border border-[var(--border-light)]">
            <div className="mb-4 text-6xl animate-float">📭</div>
            <p className="text-lg font-bold text-[var(--text)]">暂未开启任何宝箱</p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">快去开第一个吧！</p>
          </div>
        )}
        {boxes.map((b, i) => (
          <Link key={b.id} href={`/opened/${b.id}`} className={`block rounded-2xl bg-white p-5 shadow-sm border border-[var(--border-light)] transition hover:shadow-md hover:border-[var(--border)] animate-fade-up stagger-${Math.min(i + 1, 6)}`}>
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <span>📦 {b.ownerSUser?.username ?? "-"}</span>
              <span>🕒 {b.openedAt ? <LocalTime date={b.openedAt.toISOString()} /> : "-"}</span>
            </div>
            <div className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-[var(--text)]">
              {b.contentSnapshotAtOpen ?? ""}
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}

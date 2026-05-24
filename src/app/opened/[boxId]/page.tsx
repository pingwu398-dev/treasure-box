import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { AppHeader } from "@/components/AppHeader";
import { LocalTime } from "@/components/LocalTime";

export default async function OpenedDetailPage(props: { params: { boxId: string } }) {
  const me = await getCurrentUser();
  if (!me) redirect("/login");

  const box = await prisma.treasureBox.findUnique({
    where: { id: props.params.boxId },
    select: {
      id: true, status: true, openedAt: true, contentSnapshotAtOpen: true,
      ownerSUser: { select: { username: true } },
      openedByMUser: { select: { username: true } },
    },
  });
  if (!box || box.status !== "OPENED") redirect("/opened");

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-8">
      <AppHeader role={me.role} username={me.username} title="宝箱详情" />
      <main className="mx-auto max-w-lg px-4 py-5 space-y-5">
        <Link href="/opened" className="inline-flex items-center text-sm text-[var(--text-muted)] transition hover:text-[var(--text)]">
          ← 返回广场
        </Link>
        <div className="rounded-xl bg-white p-5 shadow-sm border border-[var(--border-light)]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--text-muted)] pb-4 mb-4 border-b border-[var(--border-light)]">
            <span>📦 {box.ownerSUser?.username ?? "-"}</span>
            <span>🔑 {box.openedByMUser?.username ?? "-"}</span>
            <span>🕒 {box.openedAt ? <LocalTime date={box.openedAt.toISOString()} /> : "-"}</span>
          </div>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text)]">
            {box.contentSnapshotAtOpen ?? ""}
          </div>
        </div>
      </main>
    </div>
  );
}

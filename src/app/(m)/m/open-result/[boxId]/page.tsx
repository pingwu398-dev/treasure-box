import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { AppHeader } from "@/components/AppHeader";
import { LocalTime } from "@/components/LocalTime";
import { ROLE } from "@/lib/roles";

export default async function OpenResultPage(props: { params: { boxId: string } }) {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (me.role !== ROLE.M) redirect("/");

  const box = await prisma.treasureBox.findUnique({
    where: { id: props.params.boxId },
    select: {
      id: true, status: true, openedAt: true, contentSnapshotAtOpen: true,
      openedByMUser: { select: { username: true } },
    },
  });
  if (!box || box.status !== "OPENED") redirect("/m");

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-8">
      <AppHeader role={me.role} username={me.username} title="开箱结果" />
      <main className="mx-auto max-w-lg px-4 py-5 space-y-6">
        {/* Celebration */}
        <div className="text-center pt-8">
          <div className="mb-4 text-6xl animate-float">🎉</div>
          <h1 className="text-2xl font-extrabold text-[var(--text)]">恭喜打开宝箱！</h1>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {box.openedByMUser?.username ?? "-"} · {box.openedAt ? <LocalTime date={box.openedAt.toISOString()} /> : "-"}
          </p>
        </div>

        {/* Content card */}
        <div className="rounded-xl bg-gradient-to-b from-amber-50 to-white p-5 shadow-sm border border-amber-200">
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text)]">
            {box.contentSnapshotAtOpen ?? ""}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          <Link href="/m" className="btn btn-primary w-full py-3.5 text-sm font-bold tracking-wide">
            继续开宝箱
          </Link>
          <Link href={`/opened/${box.id}`} className="btn btn-secondary w-full py-3.5 text-sm font-medium">
            在已开广场查看
          </Link>
        </div>
      </main>
    </div>
  );
}

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
    <div className="min-h-screen pb-4">
      <AppHeader role={me.role} username={me.username} title="本人已开" />
      <main className="mx-auto max-w-lg px-5 py-5 space-y-6">
        {boxes.length === 0 && (
          <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm border border-stone-200/60">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-lg font-medium text-stone-700">暂未开启任何宝箱</p>
            <p className="mt-2 text-base text-stone-500">快去开第一个吧！</p>
          </div>
        )}
        {boxes.map((b) => (
          <Link key={b.id} href={`/opened/${b.id}`} className="block rounded-2xl bg-white p-5 shadow-sm border border-stone-200/60 active:bg-stone-50">
            <div className="flex items-center gap-2 text-base text-stone-500">
              <span>🔑 {b.ownerSUser?.username ?? "-"}</span>
              <span>🕒 {b.openedAt ? <LocalTime date={b.openedAt.toISOString()} /> : "-"}</span>
            </div>
            <div className="mt-3 whitespace-pre-wrap text-lg leading-relaxed text-stone-800">
              {b.contentSnapshotAtOpen ?? ""}
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { AppHeader } from "@/components/AppHeader";
import { LocalTime } from "@/components/LocalTime";

export default async function OpenedFeedPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");

  const boxes = await prisma.treasureBox.findMany({
    where: { status: "OPENED" },
    orderBy: { openedAt: "desc" },
    take: 100,
    select: {
      id: true, openedAt: true,
      ownerSUser: { select: { username: true } },
      openedByMUser: { select: { username: true } },
    },
  });

  return (
    <div className="min-h-screen pb-4">
      <AppHeader role={me.role} username={me.username} title="已开广场" />
      <main className="mx-auto max-w-lg px-5 py-5 space-y-4">
        {boxes.length === 0 && (
          <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm border border-stone-200/60">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-lg font-medium text-stone-700">暂无已开宝箱</p>
            <p className="mt-2 text-base text-stone-500">快去打开第一个吧！</p>
          </div>
        )}
        {boxes.map((b) => (
          <Link key={b.id} href={`/opened/${b.id}`} className="block rounded-2xl bg-white p-5 shadow-sm border border-stone-200/60 active:bg-stone-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-stone-800">{b.ownerSUser?.username ?? "-"} 的宝箱</div>
                <div className="mt-1 text-base text-stone-500">
                  由 {b.openedByMUser?.username ?? "-"} 打开 · {b.openedAt ? <LocalTime date={b.openedAt.toISOString()} /> : "-"}
                </div>
              </div>
              <span className="text-amber-500 text-xl">➤</span>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}

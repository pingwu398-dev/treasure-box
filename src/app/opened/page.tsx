import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export default async function OpenedFeedPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");

  const boxes = await prisma.treasureBox.findMany({
    where: { status: "OPENED" },
    orderBy: { openedAt: "desc" },
    take: 100,
    select: {
      id: true,
      openedAt: true,
      ownerSUser: { select: { username: true } },
      openedByMUser: { select: { username: true } },
    },
  });

  return (
    <div className="min-h-screen">
      <AppHeader role={me.role} username={me.username} />
      <main className="mx-auto max-w-lg px-4 py-6 space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-[#5c3d1e]">&#x1F3B0; 已开宝箱广场</h1>
          <p className="mt-1 text-sm text-[#8b7355]">所有被打开的宝箱都在这里</p>
        </div>

        {boxes.length === 0 && (
          <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 px-5 py-10 text-center">
            <div className="text-4xl mb-3">&#x1F4ED;</div>
            <p className="text-sm text-amber-800">暂无已开宝箱，快去打开第一个吧！</p>
          </div>
        )}

        <div className="space-y-3">
          {boxes.map((b) => (
            <Link
              key={b.id}
              href={`/opened/${b.id}`}
              className="block rounded-2xl border border-amber-200/40 bg-white p-4 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-lg">
                  &#x1F4E6;
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#5c3d1e]">
                    {b.ownerSUser?.username ?? "-"} 的宝箱
                  </div>
                  <div className="mt-1 text-xs text-[#8b7355] truncate">
                    由 {b.openedByMUser?.username ?? "-"} 打开
                    &nbsp;&middot;&nbsp;
                    {b.openedAt ? b.openedAt.toLocaleString("zh-CN") : "-"}
                  </div>
                </div>
                <span className="text-amber-400 text-lg">&#x27A4;</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

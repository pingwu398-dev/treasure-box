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
    <div className="min-h-full">
      <AppHeader role={me.role} username={me.username} />
      <main className="mx-auto max-w-4xl p-4 space-y-4">
        <h1 className="text-xl font-semibold">已开宝箱广场</h1>
        <div className="space-y-2">
          {boxes.length === 0 && <p className="text-sm text-zinc-600">暂无已开宝箱。</p>}
          {boxes.map((b) => (
            <Link key={b.id} href={`/opened/${b.id}`} className="block rounded border p-3 hover:bg-zinc-50">
              <div className="font-medium">
                {b.ownerSUser?.username ?? "-"} 的宝箱
              </div>
              <div className="text-sm text-zinc-600">
                打开者：{b.openedByMUser?.username ?? "-"}；时间：
                {b.openedAt ? b.openedAt.toLocaleString("zh-CN") : "-"}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}


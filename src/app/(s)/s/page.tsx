import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/lib/roles";

export default async function SHomePage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (me.role !== ROLE.S) redirect("/");

  const boxes = await prisma.treasureBox.findMany({
    where: { ownerSUserId: me.id },
    orderBy: { createdAt: "asc" },
    select: { id: true, status: true, contentText: true, openedAt: true },
  });

  return (
    <div className="min-h-full">
      <AppHeader role={me.role} username={me.username} />
      <main className="mx-auto max-w-4xl p-4 space-y-4">
        <h1 className="text-xl font-semibold">我的宝箱</h1>
        <div className="space-y-2">
          {boxes.length === 0 && <p className="text-sm text-zinc-600">暂无宝箱，请联系管理员分配。</p>}
          {boxes.map((b, idx) => (
            <div key={b.id} className="rounded border p-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="font-medium">
                  #{idx + 1} <span className="text-sm text-zinc-600">{b.status}</span>
                </div>
                <div className="text-sm text-zinc-600 truncate">
                  {b.status === "OPENED" ? "已开（锁定）" : b.contentText ? "已填写" : "未填写"}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {b.status !== "OPENED" && (
                  <Link className="text-sm underline" href={`/s/boxes/${b.id}`}>
                    编辑
                  </Link>
                )}
                {b.status === "OPENED" && (
                  <Link className="text-sm underline" href={`/opened/${b.id}`}>
                    查看
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}


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
    select: { id: true, status: true, contentText: true },
  });

  return (
    <div className="min-h-screen pb-4">
      <AppHeader role={me.role} username={me.username} title="我的宝箱" />
      <main className="mx-auto max-w-lg px-5 py-6 space-y-5">
        <div className="mt-2">
          <span className="text-base font-semibold text-stone-600">共 {boxes.length} 个宝箱</span>
        </div>

        <div className="space-y-6">
          {boxes.length === 0 && (
            <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm border border-stone-200/60">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-lg font-medium text-stone-700">暂无宝箱</p>
              <p className="mt-2 text-base text-stone-500">请联系管理员分配</p>
            </div>
          )}

          {boxes.map((b, idx) => (
            <div key={b.id} className="rounded-2xl bg-white p-5 shadow-sm border border-stone-200/60">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-stone-700">宝箱{idx + 1}</span>
                    <span className="text-stone-500"> </span>
                    {b.status === "OPENED" && <span className="text-base font-medium text-stone-500">宝箱已打开</span>}
                    {b.status === "READY" && <span className="text-base font-medium text-stone-500">宝箱未被打开</span>}
                    {b.status === "DRAFT" && <span className="text-base font-medium text-stone-500">宝箱未被填写</span>}
                  </div>
                </div>
                {b.status !== "OPENED" && (
                  <Link href={`/s/boxes/${b.id}`} className="rounded-xl bg-[#e69a28] px-6 py-3 text-base font-bold text-white active:bg-[#c47a10]">
                    编辑
                  </Link>
                )}
                {b.status === "OPENED" && (
                  <Link href={`/opened/${b.id}`} className="rounded-xl border border-stone-300 px-5 py-3 text-base font-medium text-stone-600 active:bg-stone-50">
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

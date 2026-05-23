import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/lib/roles";

const statusBadge = (s: string) => {
  if (s === "OPENED") return "已开启";
  if (s === "READY") return "待开启";
  return "草稿";
};

const statusColor = (s: string) => {
  if (s === "OPENED") return "bg-slate-100 text-slate-600";
  if (s === "READY") return "bg-emerald-50 text-emerald-700";
  return "bg-amber-50 text-amber-700";
};

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
    <div className="min-h-screen">
      <AppHeader role={me.role} username={me.username} />
      <main className="mx-auto max-w-lg px-4 py-6 space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-[#5c3d1e]">&#x1F4E6; 我的宝箱</h1>
          <p className="mt-1 text-sm text-[#8b7355]">
            共 {boxes.length} 个宝箱
          </p>
        </div>

        {boxes.length === 0 && (
          <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 px-5 py-8 text-center">
            <div className="text-4xl mb-3">&#x1F4ED;</div>
            <p className="text-sm text-amber-800">暂无宝箱，请联系管理员分配。</p>
          </div>
        )}

        <div className="space-y-3">
          {boxes.map((b, idx) => (
            <div
              key={b.id}
              className="group rounded-2xl border border-amber-200/40 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[#5c3d1e]">#{idx + 1}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(b.status)}`}>
                      {statusBadge(b.status)}
                    </span>
                  </div>
                  <p className="mt-1.5 truncate text-sm text-[#8b7355]">
                    {b.status === "OPENED"
                      ? "宝箱已被打开"
                      : b.contentText
                        ? "内容已填写"
                        : "尚未填写内容"}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {b.status !== "OPENED" && (
                    <Link
                      href={`/s/boxes/${b.id}`}
                      className="inline-flex items-center gap-1 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                    >
                      &#x270F; 编辑
                    </Link>
                  )}
                  {b.status === "OPENED" && (
                    <Link
                      href={`/opened/${b.id}`}
                      className="inline-flex items-center gap-1 rounded-xl border border-amber-300 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-50"
                    >
                      查看
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { AdminBoxEditor } from "@/components/AdminBoxEditor";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/lib/roles";

export default async function AdminBoxDetailPage(props: { params: { boxId: string } }) {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (me.role !== ROLE.ADMIN) redirect("/");

  const box = await prisma.treasureBox.findUnique({
    where: { id: props.params.boxId },
    select: {
      id: true,
      status: true,
      contentText: true,
      openedAt: true,
      ownerSUser: { select: { id: true, username: true } },
    },
  });
  if (!box) redirect("/admin/assign-boxes");

  const disabled = box.status === "OPENED";

  return (
    <div className="min-h-screen">
      <AppHeader role={me.role} username={me.username} />
      <main className="mx-auto max-w-lg px-4 py-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#5c3d1e]">宝箱详情</h1>
          <Link
            href="/admin/assign-boxes"
            className="rounded-xl border border-amber-300 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-50"
          >
            返回
          </Link>
        </div>
        <div className="rounded-2xl border border-amber-200/40 bg-white p-4 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#8b7355]">所属 S：</span>
            <span className="font-semibold text-[#5c3d1e]">{box.ownerSUser?.username ?? "-"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#8b7355]">状态：</span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              box.status === "OPENED" ? "bg-slate-100 text-slate-600" : box.status === "READY" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
            }`}>
              {box.status === "OPENED" ? "已开" : box.status === "READY" ? "就绪" : "草稿"}
            </span>
          </div>
          {box.openedAt && (
            <div className="text-sm text-[#8b7355]">
              &#x1F552; 打开时间：{box.openedAt.toLocaleString("zh-CN")}
            </div>
          )}
        </div>
        <AdminBoxEditor boxId={box.id} initialContentText={box.contentText ?? ""} disabled={disabled} />
        {disabled && (
          <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
            &#x1F512; 已开宝箱默认锁定不可修改。
          </div>
        )}
      </main>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminBoxEditor } from "@/components/AdminBoxEditor";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { AppHeader } from "@/components/AppHeader";
import { LocalTime } from "@/components/LocalTime";
import { ROLE } from "@/lib/roles";

export default async function AdminBoxDetailPage(props: { params: { boxId: string } }) {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (me.role !== ROLE.ADMIN) redirect("/");

  const box = await prisma.treasureBox.findUnique({
    where: { id: props.params.boxId },
    select: { id: true, status: true, contentText: true, openedAt: true, ownerSUser: { select: { id: true, username: true } } },
  });
  if (!box) redirect("/admin/users");

  const disabled = box.status === "OPENED";

  return (
    <div className="min-h-screen pb-4">
      <AppHeader role={me.role} username={me.username} title="宝箱详情" />
      <main className="mx-auto max-w-lg px-5 py-5 space-y-5">
        <Link href="/admin/users" className="inline-flex items-center text-lg text-stone-500">← 返回</Link>
        <div className="rounded-2xl bg-white p-5 border border-stone-200/60 space-y-2">
          <div className="flex items-center gap-2 text-base">
            <span className="text-stone-500">所属 S：</span>
            <span className="font-bold text-stone-800">{box.ownerSUser?.username ?? "-"}</span>
          </div>
          <div className="flex items-center gap-2 text-base">
            <span className="text-stone-500">状态：</span>
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${box.status === "OPENED" ? "bg-slate-100 text-slate-600" : box.status === "READY" ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-600"}`}>
              {box.status === "OPENED" ? "已开" : box.status === "READY" ? "就绪" : "草稿"}
            </span>
          </div>
          {box.openedAt && <div className="text-base text-stone-500">🕒 <LocalTime date={box.openedAt.toISOString()} /></div>}
        </div>
        <AdminBoxEditor boxId={box.id} initialContentText={box.contentText ?? ""} disabled={disabled} />
        {disabled && <div className="rounded-xl bg-amber-50 px-5 py-4 text-base text-amber-700">🔒 已开宝箱锁定不可修改</div>}
      </main>
    </div>
  );
}

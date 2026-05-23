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
    <div className="min-h-full">
      <AppHeader role={me.role} username={me.username} />
      <main className="mx-auto max-w-4xl p-4 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold">宝箱详情</h1>
          <Link className="text-sm underline" href="/admin/assign-boxes">
            返回
          </Link>
        </div>
        <div className="rounded border p-3 space-y-1">
          <div className="text-sm text-zinc-600">所属 S：{box.ownerSUser?.username ?? "-"}</div>
          <div className="text-sm text-zinc-600">状态：{box.status}</div>
          {box.openedAt && <div className="text-sm text-zinc-600">打开时间：{box.openedAt.toLocaleString("zh-CN")}</div>}
        </div>
        <AdminBoxEditor boxId={box.id} initialContentText={box.contentText ?? ""} disabled={disabled} />
        {disabled && (
          <p className="text-sm text-zinc-600">已开宝箱默认锁定不可修改。</p>
        )}
      </main>
    </div>
  );
}


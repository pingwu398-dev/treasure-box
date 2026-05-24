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
    <div className="min-h-screen bg-[var(--bg)] pb-8">
      <AppHeader role={me.role} username={me.username} title="宝箱详情" />
      <main className="mx-auto max-w-lg px-4 py-5 space-y-4">
        <Link href="/admin/users" className="inline-flex items-center text-sm text-[var(--text-muted)] transition hover:text-[var(--text)]">
          ← 返回
        </Link>
        <div className="rounded-xl bg-white p-5 shadow-sm border border-[var(--border-light)] space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[var(--text-muted)]">所属 S：</span>
            <span className="font-bold text-[var(--text)]">{box.ownerSUser?.username ?? "-"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[var(--text-muted)]">状态：</span>
            <span className={`badge ${box.status === "OPENED" ? "status-open" : box.status === "READY" ? "status-ready" : "status-draft"}`}>
              {box.status === "OPENED" ? "已开" : box.status === "READY" ? "就绪" : "草稿"}
            </span>
          </div>
          {box.openedAt && <div className="text-xs text-[var(--text-muted)]">🕒 <LocalTime date={box.openedAt.toISOString()} /></div>}
        </div>
        <AdminBoxEditor key={box.id} boxId={box.id} initialContentText={box.contentText ?? ""} disabled={disabled} />
        {disabled && (
          <div className="animate-scale-in rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-600">
            🔒 宝箱已开启，内容已锁定
          </div>
        )}
      </main>
    </div>
  );
}

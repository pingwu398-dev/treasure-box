import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export default async function OpenedDetailPage(props: { params: { boxId: string } }) {
  const me = await getCurrentUser();
  if (!me) redirect("/login");

  const box = await prisma.treasureBox.findUnique({
    where: { id: props.params.boxId },
    select: {
      id: true,
      status: true,
      openedAt: true,
      contentSnapshotAtOpen: true,
      ownerSUser: { select: { username: true } },
      openedByMUser: { select: { username: true } },
    },
  });
  if (!box || box.status !== "OPENED") redirect("/opened");

  return (
    <div className="min-h-screen">
      <AppHeader role={me.role} username={me.username} />
      <main className="mx-auto max-w-lg px-4 py-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#5c3d1e]">{box.ownerSUser?.username ?? "-"} 的宝箱</h1>
          <Link
            href="/opened"
            className="rounded-xl border border-amber-300 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-50"
          >
            返回广场
          </Link>
        </div>
        <div className="rounded-2xl border border-amber-200/40 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3 text-xs text-[#8b7355] mb-4 pb-3 border-b border-amber-100">
            <span>&#x1F511; {box.openedByMUser?.username ?? "-"}</span>
            <span>&#x1F552; {box.openedAt ? box.openedAt.toLocaleString("zh-CN") : "-"}</span>
          </div>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-[#3d2b1f]">
            {box.contentSnapshotAtOpen ?? ""}
          </div>
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { AppHeader } from "@/components/AppHeader";
import { LocalTime } from "@/components/LocalTime";

export default async function OpenedDetailPage(props: { params: { boxId: string } }) {
  const me = await getCurrentUser();
  if (!me) redirect("/login");

  const box = await prisma.treasureBox.findUnique({
    where: { id: props.params.boxId },
    select: {
      id: true, status: true, openedAt: true, contentSnapshotAtOpen: true,
      ownerSUser: { select: { username: true } },
      openedByMUser: { select: { username: true } },
    },
  });
  if (!box || box.status !== "OPENED") redirect("/opened");

  return (
    <div className="min-h-screen pb-4">
      <AppHeader role={me.role} username={me.username} title="宝箱详情" />
      <main className="mx-auto max-w-lg px-5 py-5 space-y-5">
        <Link href="/opened" className="inline-flex items-center text-lg text-stone-500">← 返回广场</Link>
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-stone-200/60">
          <div className="flex items-center gap-3 text-base text-stone-500 mb-4 pb-4 border-b border-stone-100">
            <span>🔑 {box.openedByMUser?.username ?? "-"}</span>
            <span>🕒 {box.openedAt ? <LocalTime date={box.openedAt.toISOString()} /> : "-"}</span>
          </div>
          <div className="whitespace-pre-wrap text-lg leading-relaxed text-stone-800">
            {box.contentSnapshotAtOpen ?? ""}
          </div>
        </div>
      </main>
    </div>
  );
}

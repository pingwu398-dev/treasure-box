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
    <div className="min-h-full">
      <AppHeader role={me.role} username={me.username} />
      <main className="mx-auto max-w-4xl p-4 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold">{box.ownerSUser?.username ?? "-"} 的宝箱</h1>
          <Link className="text-sm underline" href="/opened">
            返回
          </Link>
        </div>
        <div className="rounded border p-4 space-y-2">
          <div className="text-sm text-zinc-600">
            打开者：{box.openedByMUser?.username ?? "-"}；打开时间：
            {box.openedAt ? box.openedAt.toLocaleString("zh-CN") : "-"}
          </div>
          <div className="whitespace-pre-wrap">{box.contentSnapshotAtOpen ?? ""}</div>
        </div>
      </main>
    </div>
  );
}


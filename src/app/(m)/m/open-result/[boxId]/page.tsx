import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/lib/roles";

export default async function OpenResultPage(props: { params: { boxId: string } }) {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (me.role !== ROLE.M) redirect("/");

  const box = await prisma.treasureBox.findUnique({
    where: { id: props.params.boxId },
    select: {
      id: true,
      status: true,
      openedAt: true,
      contentSnapshotAtOpen: true,
      openedByMUser: { select: { username: true } },
    },
  });
  if (!box || box.status !== "OPENED") redirect("/m");

  return (
    <div className="min-h-full">
      <AppHeader role={me.role} username={me.username} />
      <main className="mx-auto max-w-4xl p-4 space-y-4">
        <h1 className="text-xl font-semibold">开箱结果</h1>
        <div className="rounded border p-4 space-y-2">
          <div className="text-sm text-zinc-600">
            打开者：{box.openedByMUser?.username ?? "-"}；打开时间：
            {box.openedAt ? box.openedAt.toLocaleString("zh-CN") : "-"}
          </div>
          <div className="whitespace-pre-wrap">{box.contentSnapshotAtOpen ?? ""}</div>
        </div>
        <div className="flex gap-4">
          <Link className="text-sm underline" href="/m">
            返回开宝箱
          </Link>
          <Link className="text-sm underline" href={`/opened/${box.id}`}>
            在已开广场查看
          </Link>
        </div>
      </main>
    </div>
  );
}


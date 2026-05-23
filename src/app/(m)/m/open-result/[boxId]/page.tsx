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
    <div className="min-h-screen">
      <AppHeader role={me.role} username={me.username} />
      <main className="mx-auto max-w-lg px-4 py-6 space-y-5">
        <div className="text-center">
          <div className="text-5xl mb-3">&#x1F389;</div>
          <h1 className="text-2xl font-bold text-[#5c3d1e]">恭喜打开宝箱！</h1>
          <p className="mt-1 text-sm text-[#8b7355]">
            打开者：{box.openedByMUser?.username ?? "-"}
            &nbsp;&middot;&nbsp;
            {box.openedAt ? box.openedAt.toLocaleString("zh-CN") : "-"}
          </p>
        </div>
        <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-b from-amber-50 to-white p-5 shadow-lg">
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-[#3d2b1f]">
            {box.contentSnapshotAtOpen ?? ""}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/m"
            className="flex-1 rounded-xl border border-amber-300 py-3 text-center text-sm font-medium text-amber-700 transition hover:bg-amber-50"
          >
            继续开宝箱
          </Link>
          <Link
            href={`/opened/${box.id}`}
            className="flex-1 rounded-xl bg-amber-500 py-3 text-center text-sm font-semibold text-white transition hover:bg-amber-600"
          >
            在已开广场查看
          </Link>
        </div>
      </main>
    </div>
  );
}

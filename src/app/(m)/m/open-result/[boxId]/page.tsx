import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { AppHeader } from "@/components/AppHeader";
import { ROLE } from "@/lib/roles";

export default async function OpenResultPage(props: { params: { boxId: string } }) {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (me.role !== ROLE.M) redirect("/");

  const box = await prisma.treasureBox.findUnique({
    where: { id: props.params.boxId },
    select: {
      id: true, status: true, openedAt: true, contentSnapshotAtOpen: true,
      openedByMUser: { select: { username: true } },
    },
  });
  if (!box || box.status !== "OPENED") redirect("/m");

  return (
    <div className="min-h-screen pb-4">
      <AppHeader role={me.role} username={me.username} title="开箱结果" />
      <main className="mx-auto max-w-lg px-5 py-5 space-y-6">
        <div className="text-center pt-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-extrabold text-stone-800">恭喜打开宝箱！</h1>
          <p className="mt-2 text-base text-stone-500">
            {box.openedByMUser?.username ?? "-"} · {box.openedAt ? box.openedAt.toLocaleString("zh-CN") : "-"}
          </p>
        </div>
        <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-b from-amber-50 to-white p-6 shadow-lg">
          <div className="whitespace-pre-wrap text-lg leading-relaxed text-stone-800">
            {box.contentSnapshotAtOpen ?? ""}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/m" className="rounded-2xl bg-[#e69a28] py-4 text-center text-lg font-bold text-white active:bg-[#c47a10]">
            继续开宝箱
          </Link>
          <Link href={`/opened/${box.id}`} className="rounded-2xl border border-stone-300 py-4 text-center text-lg font-medium text-stone-600 active:bg-stone-50">
            在已开广场查看
          </Link>
        </div>
      </main>
    </div>
  );
}

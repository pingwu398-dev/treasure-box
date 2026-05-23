import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { OpenBoxList } from "@/components/OpenBoxList";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/lib/roles";

export default async function SBoxListPage(props: { params: { sUserId: string } }) {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (me.role !== ROLE.M) redirect("/");

  const sUser = await prisma.user.findUnique({
    where: { id: props.params.sUserId },
    select: { id: true, username: true, role: true },
  });
  if (!sUser || sUser.role !== ROLE.S) redirect("/m");

  const boxes = await prisma.treasureBox.findMany({
    where: { ownerSUserId: sUser.id, status: "READY", contentText: { not: null } },
    orderBy: { createdAt: "asc" },
    select: { id: true, createdAt: true },
  });

  return (
    <div className="min-h-screen">
      <AppHeader role={me.role} username={me.username} />
      <main className="mx-auto max-w-lg px-4 py-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#5c3d1e]">{sUser.username} 的宝箱</h1>
          <Link
            href="/m"
            className="rounded-xl border border-amber-300 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-50"
          >
            返回
          </Link>
        </div>
        {boxes.length === 0 ? (
          <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 px-5 py-10 text-center">
            <div className="text-4xl mb-3">&#x1F4E6;</div>
            <p className="text-sm text-amber-800">暂无可开的宝箱（可能还未填写或已被打开）。</p>
          </div>
        ) : (
          <OpenBoxList
            boxes={boxes.map((b) => ({ id: b.id, createdAt: b.createdAt.toISOString() }))}
          />
        )}
      </main>
    </div>
  );
}

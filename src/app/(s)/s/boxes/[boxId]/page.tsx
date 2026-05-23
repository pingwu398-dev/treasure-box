import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { BoxEditor } from "@/components/BoxEditor";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/lib/roles";

export default async function TreasureEditPage(props: { params: { boxId: string } }) {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (me.role !== ROLE.S) redirect("/");

  const box = await prisma.treasureBox.findUnique({
    where: { id: props.params.boxId },
    select: { id: true, ownerSUserId: true, status: true, contentText: true },
  });
  if (!box || box.ownerSUserId !== me.id) redirect("/s");
  if (box.status === "OPENED") redirect(`/opened/${box.id}`);

  return (
    <div className="min-h-screen">
      <AppHeader role={me.role} username={me.username} />
      <main className="mx-auto max-w-lg px-4 py-6 space-y-5">
        <h1 className="text-2xl font-bold text-[#5c3d1e]">&#x270F; 编辑宝箱</h1>
        <BoxEditor boxId={box.id} initialContentText={box.contentText ?? ""} />
      </main>
    </div>
  );
}

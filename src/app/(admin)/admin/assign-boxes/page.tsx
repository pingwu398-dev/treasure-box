import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { AdminAssignBoxes } from "@/components/AdminAssignBoxes";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/lib/roles";

export default async function AdminAssignBoxesPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (me.role !== ROLE.ADMIN) redirect("/");

  const sUsers = await prisma.user.findMany({
    where: { role: ROLE.S },
    orderBy: { username: "asc" },
    select: { id: true, username: true },
  });

  return (
    <div className="min-h-screen">
      <AppHeader role={me.role} username={me.username} />
      <main className="mx-auto max-w-xl px-4 py-6 space-y-5">
        <h1 className="text-2xl font-bold text-[#5c3d1e]">&#x1F4E6; 分配宝箱</h1>
        <AdminAssignBoxes sUsers={sUsers} />
      </main>
    </div>
  );
}

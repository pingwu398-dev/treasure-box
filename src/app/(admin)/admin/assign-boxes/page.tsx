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
    <div className="min-h-full">
      <AppHeader role={me.role} username={me.username} />
      <main className="mx-auto max-w-4xl p-4 space-y-4">
        <h1 className="text-xl font-semibold">分配宝箱</h1>
        <AdminAssignBoxes sUsers={sUsers} />
      </main>
    </div>
  );
}


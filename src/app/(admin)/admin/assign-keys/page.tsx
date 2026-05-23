import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { AdminAssignKeys } from "@/components/AdminAssignKeys";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/lib/roles";

export default async function AdminAssignKeysPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (me.role !== ROLE.ADMIN) redirect("/");

  const mUsers = await prisma.user.findMany({
    where: { role: ROLE.M },
    orderBy: { username: "asc" },
    select: { id: true, username: true, keyBalance: true },
  });

  return (
    <div className="min-h-full">
      <AppHeader role={me.role} username={me.username} />
      <main className="mx-auto max-w-4xl p-4 space-y-4">
        <h1 className="text-xl font-semibold">分配钥匙</h1>
        <AdminAssignKeys mUsers={mUsers} />
      </main>
    </div>
  );
}


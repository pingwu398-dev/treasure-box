import { redirect } from "next/navigation";
import { AdminUsersTable } from "@/components/AdminUsersTable";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { AppHeader } from "@/components/AppHeader";
import { ROLE } from "@/lib/roles";
import type { Role } from "@/lib/roles";

export default async function AdminUsersPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (me.role !== ROLE.ADMIN) redirect("/");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true, username: true, role: true, keyBalance: true, createdAt: true,
      _count: { select: { sBoxes: true } },
    },
  });

  return (
    <div className="min-h-screen pb-24">
      <AppHeader role={me.role} username={me.username} title="用户管理" />
      <main className="mx-auto max-w-3xl px-5 py-5 space-y-4">
        <h1 className="text-xl font-extrabold text-stone-800">👥 用户管理</h1>
        <AdminUsersTable
          initialUsers={users.map((u) => ({
            id: u.id, username: u.username, role: u.role as Role,
            keyBalance: u.keyBalance, boxCount: u._count.sBoxes,
            createdAt: u.createdAt.toISOString(),
          }))}
        />
      </main>
    </div>
  );
}

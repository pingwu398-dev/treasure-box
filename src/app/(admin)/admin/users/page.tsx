import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { AdminUsersTable } from "@/components/AdminUsersTable";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/lib/roles";
import type { Role } from "@/lib/roles";

export default async function AdminUsersPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (me.role !== ROLE.ADMIN) redirect("/");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, username: true, role: true, keyBalance: true, createdAt: true },
  });

  return (
    <div className="min-h-full">
      <AppHeader role={me.role} username={me.username} />
      <main className="mx-auto max-w-4xl p-4 space-y-4">
        <h1 className="text-xl font-semibold">用户管理</h1>
        <AdminUsersTable
          initialUsers={users.map((u) => ({
            ...u,
            role: u.role as Role,
            createdAt: u.createdAt.toISOString(),
          }))}
        />
      </main>
    </div>
  );
}


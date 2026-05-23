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
    <div className="min-h-screen">
      <AppHeader role={me.role} username={me.username} />
      <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#5c3d1e]">&#x1F465; 用户管理</h1>
        </div>
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

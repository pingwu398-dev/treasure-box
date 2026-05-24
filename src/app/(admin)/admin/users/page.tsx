import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { AppHeader } from "@/components/AppHeader";
import { AdminUsersTable } from "@/components/AdminUsersTable";
import { type Role } from "@/lib/roles";

export default async function AdminUsersPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (me.role !== "ADMIN") redirect("/");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true, username: true, role: true, keyBalance: true, createdAt: true,
      _count: { select: { sBoxes: true } },
    },
  });

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-8">
      <AppHeader role={me.role as Role} username={me.username} title="用户管理" />
      <main className="mx-auto max-w-3xl px-5 py-6 space-y-4">
        <h1 className="text-lg font-extrabold text-[var(--text)]">👥 用户管理</h1>
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

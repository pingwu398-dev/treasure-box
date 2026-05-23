import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { SUserSearch } from "@/components/SUserSearch";
import { getCurrentUser } from "@/lib/current-user";
import { ROLE } from "@/lib/roles";

export default async function MHomePage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (me.role !== ROLE.M) redirect("/");

  return (
    <div className="min-h-full">
      <AppHeader role={me.role} username={me.username} />
      <main className="mx-auto max-w-4xl p-4 space-y-4">
        <h1 className="text-xl font-semibold">开宝箱</h1>
        <div className="rounded border p-3">
          <div className="text-sm text-zinc-600">剩余钥匙</div>
          <div className="text-2xl font-semibold">{me.keyBalance}</div>
        </div>
        <SUserSearch />
      </main>
    </div>
  );
}


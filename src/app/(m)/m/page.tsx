import { redirect } from "next/navigation";
import { SUserSearch } from "@/components/SUserSearch";
import { getCurrentUser } from "@/lib/current-user";
import { AppHeader } from "@/components/AppHeader";
import { ROLE } from "@/lib/roles";

export default async function MHomePage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (me.role !== ROLE.M) redirect("/");

  return (
    <div className="min-h-screen pb-4">
      <AppHeader role={me.role} username={me.username} title="开宝箱" />
      <main className="mx-auto max-w-lg px-5 py-5 space-y-5">
        <div className="rounded-2xl bg-[#e69a28] p-6 shadow-sm">
          <div className="flex items-baseline justify-center gap-3">
            <span className="text-lg font-semibold text-amber-900">剩余钥匙</span>
            <span className="text-5xl font-extrabold text-white">{me.keyBalance}</span>
          </div>
          <p className="mt-2 text-center text-sm text-amber-800/70">每开一个宝箱消耗 1 把钥匙</p>
        </div>
        <SUserSearch />
      </main>
    </div>
  );
}

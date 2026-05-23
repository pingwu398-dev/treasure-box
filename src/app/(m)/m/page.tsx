import { redirect } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { SUserSearch } from "@/components/SUserSearch";
import { Leaderboard } from "@/components/Leaderboard";
import { getCurrentUser } from "@/lib/current-user";
import { AppHeader } from "@/components/AppHeader";
import { ROLE } from "@/lib/roles";

export default async function MHomePage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (me.role !== ROLE.M) redirect("/");

  return (
    <div className="min-h-screen pb-24">
      <AppHeader role={me.role} username={me.username} title="开宝箱" />
      <main className="mx-auto max-w-lg px-5 py-5 space-y-5">
        <div className="rounded-2xl bg-[#e69a28] p-6 text-center shadow-sm">
          <p className="text-base font-semibold text-amber-900">剩余钥匙</p>
          <p className="mt-1 text-5xl font-extrabold text-white">{me.keyBalance}</p>
          <p className="mt-1 text-sm text-amber-800/70">每开一个宝箱消耗 1 把钥匙</p>
        </div>
        <SUserSearch />
        <Leaderboard type="M" />
      </main>
      <BottomNav role={me.role} />
    </div>
  );
}

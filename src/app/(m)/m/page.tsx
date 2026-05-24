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
    <div className="min-h-screen bg-[var(--bg)] pb-8">
      <AppHeader role={me.role} username={me.username} title="开宝箱" />
      <main className="mx-auto max-w-lg px-5 py-6 space-y-6">
        <div className="animate-scale-in rounded-2xl bg-gradient-to-br from-[var(--gold)] via-[var(--gold-light)] to-[var(--gold)] p-6 shadow-sm border border-[var(--gold)]/20">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-base font-semibold text-amber-900/80">剩余钥匙</span>
            <span className="text-5xl font-extrabold tracking-tight text-white">{me.keyBalance}</span>
          </div>
          <p className="mt-2 text-center text-xs text-amber-800/50">每开一个宝箱消耗 1 把钥匙</p>
        </div>
        <SUserSearch />
      </main>
    </div>
  );
}

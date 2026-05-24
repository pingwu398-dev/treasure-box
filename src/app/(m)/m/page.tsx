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
      <main className="mx-auto max-w-lg px-4 py-5 space-y-5">
        {/* Key balance - prominent, actionable */}
        <div className="animate-scale-in rounded-xl bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dark)] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-100/80">我的钥匙</p>
              <p className="mt-0.5 text-3xl font-extrabold text-white">{me.keyBalance}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-2xl">🔑</div>
          </div>
          <p className="mt-2 text-[11px] text-amber-200/60">每开一个宝箱消耗 1 把钥匙</p>
        </div>

        {/* Search */}
        <SUserSearch />
      </main>
    </div>
  );
}

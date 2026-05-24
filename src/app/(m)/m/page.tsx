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
        {/* Key balance - horizontal card */}
        <div className="animate-scale-in rounded-xl bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dark)] px-5 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-semibold text-amber-100/80">我的钥匙</span>
              <span className="text-amber-100/60 text-sm">:</span>
              <span className="text-3xl font-extrabold text-white tracking-tight">{me.keyBalance}</span>
            </div>
            <span className="text-2xl">🔑</span>
          </div>
          <p className="mt-1.5 text-[11px] text-amber-200/50">每开一个宝箱消耗 1 把</p>
        </div>

        {/* Search - shows all S with boxes by default */}
        <SUserSearch />
      </main>
    </div>
  );
}

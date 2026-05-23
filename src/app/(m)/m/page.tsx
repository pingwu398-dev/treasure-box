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
    <div className="min-h-screen">
      <AppHeader role={me.role} username={me.username} />
      <main className="mx-auto max-w-lg px-4 py-6 space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-[#5c3d1e]">&#x1F511; 开宝箱</h1>
          <p className="mt-1 text-sm text-[#8b7355]">搜索 S 用户，打开他们的宝箱</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 p-5 shadow-md">
          <div className="text-center">
            <div className="text-4xl mb-1">&#x1F511;</div>
            <p className="text-sm font-medium text-amber-900">剩余钥匙</p>
            <p className="mt-1 text-4xl font-extrabold text-white drop-shadow">{me.keyBalance}</p>
            <p className="mt-1 text-xs text-amber-800/70">每开一个宝箱消耗 1 把钥匙</p>
          </div>
        </div>
        <SUserSearch />
      </main>
    </div>
  );
}

import { redirect } from "next/navigation";
import { Leaderboard } from "@/components/Leaderboard";
import { getCurrentUser } from "@/lib/current-user";
import { AppHeader } from "@/components/AppHeader";

export default async function LeaderboardPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-8">
      <AppHeader role={me.role} username={me.username} title="排行榜" />
      <main className="mx-auto max-w-lg px-5 py-6 space-y-6">
        <div className="animate-fade-up">
          <Leaderboard type="S" />
        </div>
        <div className="animate-fade-up stagger-2">
          <Leaderboard type="M" />
        </div>
      </main>
    </div>
  );
}

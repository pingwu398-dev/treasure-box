import { redirect } from "next/navigation";
import { Leaderboard } from "@/components/Leaderboard";
import { getCurrentUser } from "@/lib/current-user";
import { AppHeader } from "@/components/AppHeader";

export default async function LeaderboardPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");

  return (
    <div className="min-h-screen pb-4">
      <AppHeader role={me.role} username={me.username} title="排行榜" />
      <main className="mx-auto max-w-lg px-5 py-5 space-y-5">
        <Leaderboard type="S" />
        <Leaderboard type="M" />
      </main>
    </div>
  );
}

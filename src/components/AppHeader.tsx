"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type Role } from "@/lib/roles";

const navLinks: Record<string, { href: string; label: string }[]> = {
  S: [
    { href: "/s", label: "📦 我的宝箱" },
    { href: "/opened", label: "🎰 已开广场" },
    { href: "/leaderboard", label: "🏆 排行榜" },
  ],
  M: [
    { href: "/m", label: "🔑 开宝箱" },
    { href: "/m/my-opened", label: "🔑 本人已开" },
    { href: "/opened", label: "🎰 已开广场" },
    { href: "/leaderboard", label: "🏆 排行榜" },
  ],
  ADMIN: [
    { href: "/admin/users", label: "👥 用户管理" },
    { href: "/opened", label: "🎰 已开广场" },
    { href: "/leaderboard", label: "🏆 排行榜" },
  ],
};

export function AppHeader(props: { role: Role; username: string; title?: string }) {
  const router = useRouter();
  const links = navLinks[props.role] ?? [];

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-light)] bg-[var(--bg)]/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-lg items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-[var(--text)]">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dark)] text-sm shadow-sm">📦</span>
          <span>宝箱</span>
        </Link>
        <span className="text-sm font-semibold text-[var(--text-muted)]">
          {props.title ?? ""}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--text-light)]">{props.username}</span>
          <button onClick={logout} className="rounded-lg px-2.5 py-1 text-sm font-medium text-red-400 transition hover:bg-red-50 hover:text-red-500">
            退出
          </button>
        </div>
      </div>
      {links.length > 0 && (
        <div className="flex items-center gap-1 overflow-x-auto border-t border-[var(--border-light)] px-5 pb-2.5 pt-2 scrollbar-none">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--text-muted)] transition hover:bg-white hover:text-[var(--text)]"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

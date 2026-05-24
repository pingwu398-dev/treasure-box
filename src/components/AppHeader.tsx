"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { type Role } from "@/lib/roles";

const navLinks: Record<string, { href: string; label: string }[]> = {
  S: [
    { href: "/s", label: "📦 我的宝箱" },
    { href: "/opened", label: "🎰 广场" },
    { href: "/leaderboard", label: "🏆 排行" },
  ],
  M: [
    { href: "/m", label: "🔑 开宝箱" },
    { href: "/m/my-opened", label: "📋 已开记录" },
    { href: "/opened", label: "🎰 广场" },
    { href: "/leaderboard", label: "🏆 排行" },
  ],
  ADMIN: [
    { href: "/admin/users", label: "👥 用户管理" },
    { href: "/opened", label: "🎰 广场" },
    { href: "/leaderboard", label: "🏆 排行" },
  ],
};

export function AppHeader(props: { role: Role; username: string; title?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const links = navLinks[props.role] ?? [];

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-light)] bg-[var(--bg)]/95 backdrop-blur-lg">
      {/* Top row: logo (left), title (center), user+logout (right) */}
      <div className="mx-auto flex max-w-lg items-center px-4 h-[48px]">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-1.5 shrink-0">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dark)] text-[11px] text-white shadow-sm">📦</span>
        </Link>

        {/* Center: Page title - big and bold */}
        <div className="flex-1 flex items-center justify-center">
          {props.title && (
            <span className="text-[17px] font-extrabold tracking-tight text-[var(--text)]">{props.title}</span>
          )}
        </div>

        {/* Right: Username + logout */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[13px] font-medium text-[var(--text-muted)]">{props.username}</span>
          <button
            onClick={logout}
            className="touch-btn flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold text-red-400 transition hover:bg-red-50"
          >
            退出
          </button>
        </div>
      </div>

      {/* Nav bar */}
      {links.length > 0 && (
        <div className="flex items-center gap-0.5 overflow-x-auto border-t border-[var(--border-light)] px-3 pb-1.5 pt-1.5 scrollbar-none">
          {links.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`touch-btn whitespace-nowrap rounded-lg px-3 text-xs font-semibold transition ${
                  isActive
                    ? "bg-white text-[var(--text)] shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

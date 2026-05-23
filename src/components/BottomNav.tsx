"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Role } from "@/lib/roles";

type Tab = { href: string; label: string; icon: string };

const tabs: Record<string, Tab[]> = {
  S: [
    { href: "/s", label: "我的宝箱", icon: "📦" },
    { href: "/opened", label: "已开广场", icon: "🎰" },
  ],
  M: [
    { href: "/m", label: "开宝箱", icon: "🔑" },
    { href: "/opened", label: "已开广场", icon: "🎰" },
  ],
  ADMIN: [
    { href: "/admin/users", label: "用户管理", icon: "👥" },
    { href: "/opened", label: "已开广场", icon: "🎰" },
  ],
};

export function BottomNav(props: { role: Role }) {
  const pathname = usePathname();
  const list = tabs[props.role] ?? [];

  if (list.length === 0) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-stone-200 bg-white/90 backdrop-blur"
      style={{ paddingBottom: "var(--safe-bottom)" }}
    >
      {list.map((t) => {
        const active =
          t.href === "/opened"
            ? pathname.startsWith("/opened")
            : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-3 text-lg transition ${
              active ? "text-amber-600" : "text-stone-400"
            }`}
          >
            <span className="text-2xl">{t.icon}</span>
            <span className="text-xs font-medium">{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

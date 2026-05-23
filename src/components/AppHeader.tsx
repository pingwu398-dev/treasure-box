"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type Role } from "@/lib/roles";

const navLinks: Record<string, { href: string; label: string }[]> = {
  S: [
    { href: "/s", label: "📦 我的宝箱" },
    { href: "/opened", label: "🎰 已开广场" },
  ],
  M: [
    { href: "/m", label: "🔑 开宝箱" },
    { href: "/opened", label: "🎰 已开广场" },
  ],
  ADMIN: [
    { href: "/admin/users", label: "👥 用户管理" },
    { href: "/opened", label: "🎰 已开广场" },
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
    <header className="sticky top-0 z-50 border-b border-stone-200/60 bg-[#f8f6f2]/95 backdrop-blur">
      <div className="flex items-center justify-between px-5 py-3">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-stone-800">
          宝箱
        </Link>
        <span className="text-base font-semibold text-stone-700">
          {props.title ?? ""}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-stone-500">{props.username}</span>
          <button onClick={logout} className="text-sm text-red-500">
            退出
          </button>
        </div>
      </div>
      {links.length > 0 && (
        <div className="flex items-center gap-1 px-5 pb-2.5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-800"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

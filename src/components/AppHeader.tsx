import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";
import { ROLE, type Role } from "@/lib/roles";

export function AppHeader(props: { role: Role; username: string }) {
  const links =
    props.role === ROLE.S
      ? [
          { href: "/s", label: "我的宝箱" },
          { href: "/opened", label: "已开广场" },
        ]
      : props.role === ROLE.M
        ? [
            { href: "/m", label: "开宝箱" },
            { href: "/opened", label: "已开广场" },
          ]
        : [
            { href: "/admin/users", label: "用户管理" },
            { href: "/admin/assign-boxes", label: "分配宝箱" },
            { href: "/admin/assign-keys", label: "分配钥匙" },
            { href: "/opened", label: "已开广场" },
          ];

  return (
    <header className="sticky top-0 z-50 border-b border-amber-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-[#5c3d1e]">
          <span className="text-xl">&#x1F4E6;</span>
          <span className="hidden sm:inline text-lg tracking-tight">宝箱系统</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-[#5c4033] transition hover:bg-amber-50 hover:text-[#b8860b]"
            >
              {l.label}
            </Link>
          ))}
          <span className="hidden sm:inline text-sm text-amber-800/70 font-medium mx-1">
            {props.username}
          </span>
          <LogoutButton />
        </nav>
      </div>
    </header>
  );
}

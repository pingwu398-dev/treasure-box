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
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between p-4">
        <Link href="/" className="font-semibold">
          Treasure Box
        </Link>
        <nav className="flex items-center gap-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm underline">
              {l.label}
            </Link>
          ))}
          <span className="text-sm text-zinc-600">{props.username}</span>
          <LogoutButton />
        </nav>
      </div>
    </header>
  );
}


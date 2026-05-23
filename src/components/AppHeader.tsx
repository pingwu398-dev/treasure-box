"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type Role } from "@/lib/roles";

export function AppHeader(props: { role: Role; username: string; title?: string }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-stone-200/60 bg-[#f8f6f2]/90 px-5 py-4 backdrop-blur">
      <Link href="/" className="text-2xl font-extrabold tracking-tight text-stone-800">
        宝箱
      </Link>
      <span className="text-base font-semibold text-stone-700">
        {props.title ?? ""}
      </span>
      <div className="flex items-center gap-3">
        <span className="text-sm text-stone-500">{props.username}</span>
        <span className="text-base text-stone-300">|</span>
        <button onClick={logout} className="text-base text-stone-500">
          退出
        </button>
      </div>
    </header>
  );
}

"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
      onClick={async () => {
        await fetch("/api/logout", { method: "POST" });
        router.replace("/login");
      }}
    >
      退出
    </button>
  );
}

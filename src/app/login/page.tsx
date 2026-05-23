"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="mx-auto max-w-md p-6 space-y-4">
      <h1 className="text-xl font-semibold">登录</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <input
        className="w-full rounded border p-2"
        placeholder="用户名"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="w-full rounded border p-2"
        placeholder="密码"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="w-full rounded bg-black py-2 text-white"
        onClick={async () => {
          setError(null);
          const res = await fetch("/api/login", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ username, password }),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) return setError(data?.error ?? "登录失败");
          router.replace(next);
        }}
      >
        登录
      </button>
      <a className="block text-sm underline" href="/register">
        去注册
      </a>
    </main>
  );
}


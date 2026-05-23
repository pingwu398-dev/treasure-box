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
  const [loading, setLoading] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-2xl">
            📦
          </div>
          <h1 className="text-xl font-bold">宝箱系统</h1>
          <p className="mt-1 text-sm text-zinc-500">登录你的账号</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">用户名</label>
            <input
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">密码</label>
            <input
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              placeholder="请输入密码"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            disabled={loading}
            className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-60"
            onClick={async () => {
              setError(null);
              setLoading(true);
              const res = await fetch("/api/login", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ username, password }),
              });
              const data = await res.json().catch(() => ({}));
              setLoading(false);
              if (!res.ok) return setError(data?.error ?? "登录失败");
              router.replace(next);
            }}
          >
            {loading ? "登录中…" : "登 录"}
          </button>
        </div>

        <div className="mt-5 text-center text-sm text-zinc-500">
          还没有账号？
          <a className="ml-1 font-medium text-amber-600 hover:underline" href="/register">
            立即注册
          </a>
        </div>
      </div>
    </main>
  );
}

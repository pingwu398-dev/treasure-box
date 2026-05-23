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
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-amber-50 to-orange-50 px-4">
      <div className="w-full max-w-sm rounded-3xl border border-amber-200/60 bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-3xl shadow-lg shadow-amber-200">
            &#x1F4E6;
          </div>
          <h1 className="text-2xl font-extrabold text-[#5c3d1e]">宝箱系统</h1>
          <p className="mt-1 text-sm text-[#8b7355]">登录你的账号</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#5c4033]">用户名</label>
            <input
              className="w-full rounded-xl border border-amber-200/60 bg-amber-50/30 px-4 py-3 text-sm text-[#3d2b1f] placeholder-[#c4b49a] outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#5c4033]">密码</label>
            <input
              className="w-full rounded-xl border border-amber-200/60 bg-amber-50/30 px-4 py-3 text-sm text-[#3d2b1f] placeholder-[#c4b49a] outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
              placeholder="请输入密码"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-sm font-bold text-white shadow-lg shadow-amber-200 transition hover:from-amber-600 hover:to-amber-700 disabled:opacity-60"
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

        <div className="mt-5 text-center text-sm text-[#8b7355]">
          还没有账号？
          <a className="ml-1 font-semibold text-amber-600 hover:underline" href="/register">
            立即注册
          </a>
        </div>
      </div>
    </main>
  );
}

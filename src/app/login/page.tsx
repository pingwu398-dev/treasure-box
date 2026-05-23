"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <main className="flex min-h-screen flex-col justify-center bg-[#f8f6f2] px-5 pb-20 pt-12">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#e69a28] text-4xl shadow-lg shadow-amber-200">📦</div>
          <h1 className="text-3xl font-extrabold text-stone-800 tracking-tight">宝箱系统</h1>
          <p className="mt-2 text-lg text-stone-500">登录你的账号</p>
        </div>

        {error && <div className="mb-5 rounded-2xl bg-red-50 px-5 py-4 text-center text-lg font-medium text-red-700">{error}</div>}

        <div className="space-y-4">
          <input
            className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-5 text-lg text-stone-800 placeholder-stone-400 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="relative">
            <input
              className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-5 pr-20 text-lg text-stone-800 placeholder-stone-400 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              placeholder="密码"
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-stone-100 px-3 py-1 text-sm text-stone-500"
              onClick={() => setShowPwd(!showPwd)}
            >
              {showPwd ? "隐藏" : "查看"}
            </button>
          </div>
          <button
            disabled={loading}
            className="w-full rounded-2xl bg-[#e69a28] py-5 text-xl font-extrabold text-white shadow-lg shadow-amber-200 active:bg-[#c47a10] disabled:opacity-50"
            onClick={async () => {
              setError(null); setLoading(true);
              const res = await fetch("/api/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ username, password }) });
              const data = await res.json().catch(() => ({}));
              setLoading(false);
              if (!res.ok) return setError(data?.error ?? "登录失败");
              window.location.href = next;
            }}
          >{loading ? "登录中…" : "登 录"}</button>
        </div>

        <div className="mt-6 text-center text-lg text-stone-500">
          还没有账号？
        </div>
        <div className="text-center">
          <a className="font-extrabold text-[#e69a28]" href="/register">立即注册</a>
        </div>
      </div>
    </main>
  );
}

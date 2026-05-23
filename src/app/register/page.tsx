"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [role, setRole] = useState<"S" | "M">("S");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-2xl">
            ✨
          </div>
          <h1 className="text-xl font-bold">注册新账号</h1>
          <p className="mt-1 text-sm text-zinc-500">选择身份，创建账号</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700">
            {error}
          </div>
        )}
        {result && (
          <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-center text-sm text-green-700">
            {result}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">身份</label>
            <div className="flex gap-2">
              <button
                className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition ${
                  role === "S"
                    ? "border-amber-500 bg-amber-50 text-amber-700"
                    : "border-zinc-300 text-zinc-600 hover:bg-zinc-50"
                }`}
                onClick={() => setRole("S")}
              >
                📝 写宝箱（S）
              </button>
              <button
                className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition ${
                  role === "M"
                    ? "border-amber-500 bg-amber-50 text-amber-700"
                    : "border-zinc-300 text-zinc-600 hover:bg-zinc-50"
                }`}
                onClick={() => setRole("M")}
              >
                🔑 开宝箱（M）
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">用户名</label>
            <input
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              placeholder="取个名字（至少2个字）"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">密码</label>
            <input
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              placeholder="至少6位密码"
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
              setResult(null);
              setLoading(true);
              const res = await fetch("/api/register", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ role, username, password }),
              });
              const data = await res.json().catch(() => ({}));
              setLoading(false);
              if (!res.ok) return setError(data?.error ?? "注册失败");
              setResult("注册成功！请去登录。");
            }}
          >
            {loading ? "注册中…" : "注 册"}
          </button>
        </div>

        <div className="mt-5 text-center text-sm text-zinc-500">
          已有账号？
          <a className="ml-1 font-medium text-amber-600 hover:underline" href="/login">
            去登录
          </a>
        </div>
      </div>
    </main>
  );
}

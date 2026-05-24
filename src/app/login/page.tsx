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
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-5 pb-16">
      <div className="mx-auto w-full max-w-sm animate-fade-up">
        {/* Logo area */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dark)] text-3xl shadow-lg shadow-[var(--gold-glow)]">
            📦
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text)]">宝箱系统</h1>
          <p className="mt-1 text-sm text-[var(--text-light)]">登录你的账号</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 animate-scale-in rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-500">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-3">
          <input
            className="input"
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="relative">
            <input
              className="input pr-[72px]"
              placeholder="密码"
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-[var(--bg)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-light)] transition hover:bg-[var(--border)]"
              onClick={() => setShowPwd(!showPwd)}
            >
              {showPwd ? "隐藏" : "查看"}
            </button>
          </div>
          <button
            disabled={loading}
            className="btn btn-primary w-full py-3.5 text-[15px] disabled:opacity-50"
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

        {/* Register link */}
        <div className="mt-8 text-center">
          <span className="text-sm text-[var(--text-light)]">还没有账号？</span>
          <a className="ml-1 text-sm font-bold text-[var(--gold)] hover:text-[var(--gold-dark)]" href="/register">立即注册</a>
        </div>
      </div>
    </main>
  );
}

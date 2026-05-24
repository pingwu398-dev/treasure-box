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
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-5 pb-20 pt-12">
      <div className="mx-auto w-full max-w-sm animate-fade-up">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 animate-float items-center justify-center rounded-[22px] bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dark)] text-4xl shadow-lg shadow-[var(--gold-glow)]">
            📦
          </div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-[var(--text)]">欢迎回来</h1>
          <p className="mt-2 text-base text-[var(--text-muted)]">登录你的宝箱账号</p>
        </div>

        {error && (
          <div className="mb-5 animate-scale-in rounded-2xl bg-red-50 px-5 py-4 text-center text-base font-medium text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-3.5">
          <input
            className="w-full rounded-2xl border border-[var(--border)] bg-white px-5 py-4 text-base text-[var(--text)] placeholder-[var(--text-light)] outline-none transition focus:border-[var(--gold)] focus:ring-4 focus:ring-[var(--gold-glow)]"
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="relative">
            <input
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-5 py-4 pr-20 text-base text-[var(--text)] placeholder-[var(--text-light)] outline-none transition focus:border-[var(--gold)] focus:ring-4 focus:ring-[var(--gold-glow)]"
              placeholder="密码"
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-xl bg-[var(--bg)] px-3 py-1.5 text-sm font-medium text-[var(--text-muted)] transition hover:bg-[var(--border)]"
              onClick={() => setShowPwd(!showPwd)}
            >
              {showPwd ? "隐藏" : "查看"}
            </button>
          </div>
          <button
            disabled={loading}
            className="btn-gold w-full py-4 text-lg tracking-wide disabled:opacity-50"
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

        <div className="mt-8 text-center text-base text-[var(--text-muted)]">
          还没有账号？
        </div>
        <div className="mt-1.5 text-center">
          <a className="text-base font-bold text-[var(--gold)] transition hover:text-[var(--gold-dark)]" href="/register">立即注册 →</a>
        </div>
      </div>
    </main>
  );
}

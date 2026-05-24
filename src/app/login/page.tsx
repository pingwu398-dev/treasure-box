"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { EyeToggle } from "@/components/EyeToggle";

export default function LoginPage() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-6">
      <div className="mx-auto w-full max-w-[340px] animate-fade-up">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dark)] text-2xl shadow-lg shadow-[var(--gold-glow)]">
            📦
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-[var(--text)]">宝箱系统</h1>
          <p className="mt-0.5 text-sm text-[var(--text-light)]">登录你的账号</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 animate-scale-in rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-500">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          <input
            className="input h-12"
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="relative">
            <input
              className="input h-12 pr-[54px]"
              placeholder="密码"
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <EyeToggle showing={showPwd} onClick={() => setShowPwd(!showPwd)} />
          </div>
          <div className="flex justify-center">
            <button
              disabled={loading}
              className="btn btn-primary w-1/2 h-12 text-base font-bold tracking-widest disabled:opacity-50"
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
        </div>

        {/* Register link - pill style */}
        <div className="mt-10 text-center">
          <a
            href="/register"
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white px-6 py-2.5 text-sm font-semibold text-[var(--text)] shadow-sm transition hover:border-[var(--gold)] hover:text-[var(--gold)] active:scale-[0.97]"
          >
            还没有账号？立即注册
            <span className="text-base">→</span>
          </a>
        </div>
      </div>
    </main>
  );
}

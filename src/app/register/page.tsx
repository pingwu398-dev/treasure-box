"use client";

import { useState } from "react";
import { EyeToggle } from "@/components/EyeToggle";

export default function RegisterPage() {
  const [role, setRole] = useState<"S" | "M">("S");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const icon = role === "S" ? "📦" : "🔑";
  const isS = role === "S";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-6">
      <div className="mx-auto w-full max-w-[340px] animate-fade-up">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-lg transition ${
            isS
              ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-200"
              : "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-200"
          }`}>
            {icon}
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-[var(--text)]">创建新账号</h1>
          <p className="mt-0.5 text-sm text-[var(--text-light)]">选择身份开始使用</p>
        </div>

        {/* Messages */}
        {error && <div className="mb-4 animate-scale-in rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-500">{error}</div>}
        {result && <div className="mb-4 animate-scale-in rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-green-600">{result}</div>}

        <div className="space-y-3.5">
          {/* Role selector */}
          <div className="flex gap-3">
            <button
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-3.5 text-sm font-bold transition-all ${
                isS
                  ? "scale-[1.02] border-2 border-blue-400 bg-blue-50 text-blue-700 shadow-sm"
                  : "border border-[var(--border)] bg-white text-[var(--text-light)] hover:bg-[var(--bg)] active:scale-[0.98]"
              }`}
              onClick={() => setRole("S")}
            >
              <span className="text-2xl">📦</span>
              <span className="mt-0.5 text-[13px]">写宝箱</span>
              <span className="text-[10px] opacity-50">S</span>
            </button>
            <button
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-3.5 text-sm font-bold transition-all ${
                !isS
                  ? "scale-[1.02] border-2 border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm"
                  : "border border-[var(--border)] bg-white text-[var(--text-light)] hover:bg-[var(--bg)] active:scale-[0.98]"
              }`}
              onClick={() => setRole("M")}
            >
              <span className="text-2xl">🔑</span>
              <span className="mt-0.5 text-[13px]">开宝箱</span>
              <span className="text-[10px] opacity-50">M</span>
            </button>
          </div>

          {/* Inputs */}
          <div className="relative">
            <input
              className="input w-full pl-[42px]"
              placeholder="取个名字"
              value={username} onChange={(e) => setUsername(e.target.value)}
            />
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base">{icon}</span>
          </div>
          <div className="relative">
            <input
              className="input w-full pr-[44px]"
              placeholder="至少6位密码"
              type={showPwd ? "text" : "password"}
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <EyeToggle showing={showPwd} onClick={() => setShowPwd(!showPwd)} />
          </div>
          <div className="relative">
            <input
              className="input w-full pr-[44px]"
              placeholder="再次输入密码"
              type={showPwd2 ? "text" : "password"}
              value={password2} onChange={(e) => setPassword2(e.target.value)}
            />
            <EyeToggle showing={showPwd2} onClick={() => setShowPwd2(!showPwd2)} />
          </div>

          {/* Register button */}
          <button
            disabled={loading}
            className={`btn w-full rounded-xl py-[14px] text-base font-bold tracking-wider disabled:opacity-50 ${
              isS
                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-200"
                : "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-200"
            }`}
            onClick={async () => {
              setError(null); setResult(null);
              if (password.length < 6) { setError("密码至少 6 位"); return; }
              if (password !== password2) { setError("两次密码不一致"); return; }
              setLoading(true);
              const res = await fetch("/api/register", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ role, username, password }) });
              const data = await res.json().catch(() => ({}));
              setLoading(false);
              if (!res.ok) return setError(data?.error ?? "注册失败");
              setResult("✅ 注册成功！请去登录。");
            }}
          >{loading ? "注册中…" : "注 册"}</button>
        </div>

        {/* Login link */}
        <div className="mt-11 text-center">
          <a
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-white px-6 py-2.5 text-sm font-semibold text-[var(--text)] shadow-sm transition hover:border-[var(--gold)] hover:text-[var(--gold)] active:scale-[0.97]"
          >
            已有账号？去登录
            <span className="text-base">→</span>
          </a>
        </div>
      </div>
    </main>
  );
}

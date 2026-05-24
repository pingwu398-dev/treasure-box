"use client";

import { useState } from "react";

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-5 pb-16">
      <div className="mx-auto w-full max-w-sm animate-fade-up">
        {/* Logo area */}
        <div className="mb-8 flex flex-col items-center">
          <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-lg transition ${
            role === "S" ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-200" : "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-200"
          }`}>
            {icon}
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text)]">创建新账号</h1>
          <p className="mt-1 text-sm text-[var(--text-light)]">选择身份，开始使用</p>
        </div>

        {/* Messages */}
        {error && <div className="mb-4 animate-scale-in rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-500">{error}</div>}
        {result && <div className="mb-4 animate-scale-in rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-green-600">{result}</div>}

        <div className="space-y-3">
          {/* Role selector - more visual */}
          <div className="flex gap-2.5">
            <button
              className={`flex flex-1 flex-col items-center gap-1 rounded-2xl py-4 text-sm font-bold transition-all ${
                role === "S"
                  ? "scale-[1.02] border-2 border-blue-400 bg-blue-50 text-blue-700 shadow-sm"
                  : "border border-[var(--border)] bg-white text-[var(--text-light)] hover:bg-[var(--bg)]"
              }`}
              onClick={() => setRole("S")}
            >
              <span className="text-2xl">📦</span>
              <span className="mt-0.5">写宝箱</span>
              <span className="text-[10px] opacity-60">S</span>
            </button>
            <button
              className={`flex flex-1 flex-col items-center gap-1 rounded-2xl py-4 text-sm font-bold transition-all ${
                role === "M"
                  ? "scale-[1.02] border-2 border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm"
                  : "border border-[var(--border)] bg-white text-[var(--text-light)] hover:bg-[var(--bg)]"
              }`}
              onClick={() => setRole("M")}
            >
              <span className="text-2xl">🔑</span>
              <span className="mt-0.5">开宝箱</span>
              <span className="text-[10px] opacity-60">M</span>
            </button>
          </div>

          {/* Username */}
          <div className="relative">
            <input
              className="input pl-[42px]"
              placeholder="取个名字（至少2个字）"
              value={username} onChange={(e) => setUsername(e.target.value)}
            />
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base">{icon}</span>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              className="input pr-[72px]"
              placeholder="至少6位密码"
              type={showPwd ? "text" : "password"}
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-[var(--bg)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-light)] transition hover:bg-[var(--border)]"
              onClick={() => setShowPwd(!showPwd)}
            >
              {showPwd ? "隐藏" : "查看"}
            </button>
          </div>

          {/* Confirm password */}
          <div className="relative">
            <input
              className="input pr-[72px]"
              placeholder="再次输入密码"
              type={showPwd2 ? "text" : "password"}
              value={password2} onChange={(e) => setPassword2(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-[var(--bg)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-light)] transition hover:bg-[var(--border)]"
              onClick={() => setShowPwd2(!showPwd2)}
            >
              {showPwd2 ? "隐藏" : "查看"}
            </button>
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            className={`btn w-full py-3.5 text-[15px] disabled:opacity-50 ${
              role === "S"
                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm shadow-blue-200"
                : "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-sm shadow-emerald-200"
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

        <div className="mt-8 text-center text-sm text-[var(--text-light)]">
          已有账号？<a className="font-bold text-[var(--gold)] hover:text-[var(--gold-dark)]" href="/login">去登录</a>
        </div>
      </div>
    </main>
  );
}

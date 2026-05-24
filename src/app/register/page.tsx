"use client";

import { useState } from "react";

function EyeToggle(props: { showing: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-xl bg-[var(--bg)] px-3 py-1.5 text-sm font-medium text-[var(--text-muted)] transition hover:bg-[var(--border)]"
      onClick={props.onClick}
    >
      {props.showing ? "隐藏" : "查看"}
    </button>
  );
}

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
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-5 pb-20 pt-12">
      <div className="mx-auto w-full max-w-sm animate-fade-up">
        <div className="mb-10 text-center">
          <div
            className={`mx-auto mb-5 flex h-20 w-20 animate-float items-center justify-center rounded-[22px] text-4xl shadow-lg transition ${
              role === "S"
                ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-200"
                : "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-200"
            }`}
          >
            {icon}
          </div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-[var(--text)]">创建新账号</h1>
          <p className="mt-2 text-base text-[var(--text-muted)]">选择你的身份</p>
        </div>

        {error && <div className="mb-5 animate-scale-in rounded-2xl bg-red-50 px-5 py-4 text-center text-base font-medium text-red-600">{error}</div>}
        {result && <div className="mb-5 animate-scale-in rounded-2xl bg-emerald-50 px-5 py-4 text-center text-base font-medium text-emerald-600">{result}</div>}

        <div className="space-y-3.5">
          <div className="flex gap-3">
            <button
              className={`flex-1 rounded-2xl py-4 text-lg font-extrabold transition-all ${
                role === "S"
                  ? "scale-[1.02] border-2 border-blue-400 bg-blue-50 text-blue-700 shadow-md"
                  : "border border-[var(--border)] bg-white text-[var(--text-light)] hover:bg-[var(--bg)]"
              }`}
              onClick={() => setRole("S")}
            >
              <div className="text-2xl">📦</div>
              <div className="mt-1 text-sm font-bold">S</div>
            </button>
            <button
              className={`flex-1 rounded-2xl py-4 text-lg font-extrabold transition-all ${
                role === "M"
                  ? "scale-[1.02] border-2 border-emerald-400 bg-emerald-50 text-emerald-700 shadow-md"
                  : "border border-[var(--border)] bg-white text-[var(--text-light)] hover:bg-[var(--bg)]"
              }`}
              onClick={() => setRole("M")}
            >
              <div className="text-2xl">🔑</div>
              <div className="mt-1 text-sm font-bold">M</div>
            </button>
          </div>
          <div className="relative">
            <input
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-5 py-4 pr-14 text-base text-[var(--text)] placeholder-[var(--text-light)] outline-none transition focus:border-[var(--gold)] focus:ring-4 focus:ring-[var(--gold-glow)]"
              placeholder="取个名字"
              value={username} onChange={(e) => setUsername(e.target.value)}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg">{icon}</span>
          </div>
          <div className="relative">
            <input
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-5 py-4 pr-20 text-base text-[var(--text)] placeholder-[var(--text-light)] outline-none transition focus:border-[var(--gold)] focus:ring-4 focus:ring-[var(--gold-glow)]"
              placeholder="至少6位密码"
              type={showPwd ? "text" : "password"}
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <EyeToggle showing={showPwd} onClick={() => setShowPwd(!showPwd)} />
          </div>
          <div className="relative">
            <input
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-5 py-4 pr-20 text-base text-[var(--text)] placeholder-[var(--text-light)] outline-none transition focus:border-[var(--gold)] focus:ring-4 focus:ring-[var(--gold-glow)]"
              placeholder="再次输入密码"
              type={showPwd2 ? "text" : "password"}
              value={password2} onChange={(e) => setPassword2(e.target.value)}
            />
            <EyeToggle showing={showPwd2} onClick={() => setShowPwd2(!showPwd2)} />
          </div>
          <button
            disabled={loading}
            className={`btn-gold w-full py-4 text-lg tracking-wide disabled:opacity-50 ${
              role === "S" ? "" : "from-emerald-500 via-emerald-500 to-emerald-600 shadow-emerald-200 hover:shadow-emerald-300"
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
              setResult("注册成功！请去登录。");
            }}
          >{loading ? "注册中…" : "注 册"}</button>
        </div>

        <div className="mt-8 text-center text-base text-[var(--text-muted)]">
          已有账号？<a className="font-bold text-[var(--gold)] transition hover:text-[var(--gold-dark)]" href="/login">去登录 →</a>
        </div>
      </div>
    </main>
  );
}

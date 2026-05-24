"use client";

import { useState } from "react";

function EyeToggle(props: { showing: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-stone-100 px-3 py-1 text-sm text-stone-500"
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

  return (
    <main className="flex min-h-screen flex-col justify-center bg-[#f8f6f2] px-5 pb-20 pt-12">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-10 text-center">
          <div
            className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl text-4xl shadow-lg transition ${
              role === "S" ? "bg-blue-500 shadow-blue-200" : "bg-emerald-500 shadow-emerald-200"
            }`}
          >
            {role === "S" ? "📝" : "🔑"}
          </div>
          <h1 className="text-3xl font-extrabold text-stone-800 tracking-tight">注册新账号</h1>
          <p className="mt-2 text-lg text-stone-500">选择身份，创建账号</p>
        </div>

        {error && <div className="mb-5 rounded-2xl bg-red-50 px-5 py-4 text-center text-lg font-medium text-red-700">{error}</div>}
        {result && <div className="mb-5 rounded-2xl bg-emerald-50 px-5 py-4 text-center text-lg font-medium text-emerald-700">{result}</div>}

        <div className="space-y-4">
          <div className="flex gap-3">
            <button
              className={`flex-1 rounded-2xl py-5 text-lg font-extrabold transition-all ${
                role === "S"
                  ? "bg-blue-50 border-2 border-blue-400 text-blue-700 shadow-sm shadow-blue-100 scale-105"
                  : "bg-white border border-stone-200 text-stone-400 hover:bg-stone-50"
              }`}
              onClick={() => setRole("S")}
            >
              <div className="text-2xl">📝</div>
              <div className="text-sm font-bold mt-1">S</div>
            </button>
            <button
              className={`flex-1 rounded-2xl py-5 text-lg font-extrabold transition-all ${
                role === "M"
                  ? "bg-emerald-50 border-2 border-emerald-400 text-emerald-700 shadow-sm shadow-emerald-100 scale-105"
                  : "bg-white border border-stone-200 text-stone-300 hover:bg-stone-50"
              }`}
              onClick={() => setRole("M")}
            >
              <div className="text-2xl">🔑</div>
              <div className="text-sm font-bold mt-1">M</div>
            </button>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">📝</span>
            <input
              className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-5 pl-12 text-lg text-stone-800 placeholder-stone-400 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              placeholder="取个名字"
              value={username} onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="relative">
            <input
              className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-5 pr-20 text-lg text-stone-800 placeholder-stone-400 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              placeholder="至少6位密码"
              type={showPwd ? "text" : "password"}
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <EyeToggle showing={showPwd} onClick={() => setShowPwd(!showPwd)} />
          </div>
          <div className="relative">
            <input
              className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-5 pr-20 text-lg text-stone-800 placeholder-stone-400 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
              placeholder="再次输入密码"
              type={showPwd2 ? "text" : "password"}
              value={password2} onChange={(e) => setPassword2(e.target.value)}
            />
            <EyeToggle showing={showPwd2} onClick={() => setShowPwd2(!showPwd2)} />
          </div>
          <button
            disabled={loading}
            className={`w-full rounded-2xl py-5 text-xl font-extrabold text-white shadow-lg active:scale-[0.98] disabled:opacity-50 transition ${
              role === "S" ? "bg-blue-500 shadow-blue-200 active:bg-blue-600" : "bg-emerald-500 shadow-emerald-200 active:bg-emerald-600"
            }`}
            onClick={async () => {
              setError(null); setResult(null);

              if (password.length < 6) {
                setError("密码至少 6 位"); return;
              }
              if (password !== password2) {
                setError("两次密码不一致"); return;
              }

              setLoading(true);
              const res = await fetch("/api/register", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ role, username, password }) });
              const data = await res.json().catch(() => ({}));
              setLoading(false);
              if (!res.ok) return setError(data?.error ?? "注册失败");
              setResult("注册成功！请去登录。");
            }}
          >{loading ? "注册中…" : "注 册"}</button>
        </div>

        <div className="mt-6 text-center text-lg text-stone-500">
          已有账号？<a className="font-extrabold text-[#e69a28]" href="/login">去登录</a>
        </div>
      </div>
    </main>
  );
}

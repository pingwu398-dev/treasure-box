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
    <main className="flex min-h-screen flex-col justify-center bg-[#f8f6f2] px-5 pb-20 pt-12">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#e69a28] text-4xl shadow-lg shadow-amber-200">✨</div>
          <h1 className="text-3xl font-extrabold text-stone-800 tracking-tight">注册新账号</h1>
          <p className="mt-2 text-lg text-stone-500">选择身份，创建账号</p>
        </div>

        {error && <div className="mb-5 rounded-2xl bg-red-50 px-5 py-4 text-center text-lg font-medium text-red-700">{error}</div>}
        {result && <div className="mb-5 rounded-2xl bg-emerald-50 px-5 py-4 text-center text-lg font-medium text-emerald-700">{result}</div>}

        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              className={`flex-1 rounded-2xl border py-4 text-lg font-bold transition ${role === "S" ? "border-[#e69a28] bg-amber-50 text-amber-700" : "border-stone-200 text-stone-500"}`}
              onClick={() => setRole("S")}
            >📝 写宝箱 S</button>
            <button
              className={`flex-1 rounded-2xl border py-4 text-lg font-bold transition ${role === "M" ? "border-[#e69a28] bg-amber-50 text-amber-700" : "border-stone-200 text-stone-500"}`}
              onClick={() => setRole("M")}
            >🔑 开宝箱 M</button>
          </div>
          <input
            className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-5 text-lg text-stone-800 placeholder-stone-400 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            placeholder="取个名字（至少2个字）"
            value={username} onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-5 text-lg text-stone-800 placeholder-stone-400 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            placeholder="至少6位密码" type="password"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <button
            disabled={loading}
            className="w-full rounded-2xl bg-[#e69a28] py-5 text-xl font-extrabold text-white shadow-lg shadow-amber-200 active:bg-[#c47a10] disabled:opacity-50"
            onClick={async () => {
              setError(null); setResult(null); setLoading(true);
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

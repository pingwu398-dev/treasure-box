"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [role, setRole] = useState<"S" | "M">("S");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="mx-auto max-w-md p-6 space-y-4">
      <h1 className="text-xl font-semibold">注册</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {result && <p className="text-sm text-green-700">{result}</p>}

      <div className="flex gap-2">
        <button
          className={`flex-1 rounded border py-2 ${role === "S" ? "bg-black text-white" : ""}`}
          onClick={() => setRole("S")}
        >
          S
        </button>
        <button
          className={`flex-1 rounded border py-2 ${role === "M" ? "bg-black text-white" : ""}`}
          onClick={() => setRole("M")}
        >
          M
        </button>
      </div>

      <input
        className="w-full rounded border p-2"
        placeholder="用户名（唯一）"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="w-full rounded border p-2"
        placeholder="密码（>=6位）"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="w-full rounded bg-black py-2 text-white"
        onClick={async () => {
          setError(null);
          setResult(null);
          const res = await fetch("/api/register", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ role, username, password }),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) return setError(data?.error ?? "注册失败");
          setResult(`注册成功，user_id=${data.user.id}。请去登录。`);
        }}
      >
        注册
      </button>

      <a className="block text-sm underline" href="/login">
        去登录
      </a>
    </main>
  );
}


"use client";

import { useState } from "react";

type MUser = { id: string; username: string; keyBalance: number };

export function AdminAssignKeys(props: { mUsers: MUser[] }) {
  const [mUserId, setMUserId] = useState(props.mUsers[0]?.id ?? "");
  const [delta, setDelta] = useState("1");
  const [balances, setBalances] = useState<Record<string, number>>(
    Object.fromEntries(props.mUsers.map((u) => [u.id, u.keyBalance])),
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const currentBalance = mUserId ? balances[mUserId] ?? 0 : 0;

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="rounded border p-3 space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select className="rounded border p-2 flex-1" value={mUserId} onChange={(e) => setMUserId(e.target.value)}>
            {props.mUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
          <input
            className="rounded border p-2 w-full sm:w-32"
            value={delta}
            onChange={(e) => setDelta(e.target.value)}
            inputMode="numeric"
            placeholder="增减"
          />
          <button
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            disabled={!mUserId || loading}
            onClick={async () => {
              setError(null);
              setLoading(true);
              try {
                const res = await fetch(`/api/admin/m-users/${mUserId}/keys`, {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ delta }),
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) return setError(data?.error ?? "分配失败");
                const nextBalance = data?.user?.keyBalance;
                if (typeof nextBalance === "number") {
                  setBalances((prev) => ({ ...prev, [mUserId]: nextBalance }));
                }
              } finally {
                setLoading(false);
              }
            }}
          >
            更新钥匙
          </button>
        </div>
        <div className="text-sm text-zinc-600">当前余额：{currentBalance}</div>
      </div>
    </div>
  );
}


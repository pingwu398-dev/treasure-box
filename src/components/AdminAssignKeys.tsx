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
    <div className="space-y-5">
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      <div className="rounded-2xl border border-amber-200/40 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            className="rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm flex-1"
            value={mUserId}
            onChange={(e) => setMUserId(e.target.value)}
          >
            {props.mUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
          <input
            className="rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm w-full sm:w-24"
            value={delta}
            onChange={(e) => setDelta(e.target.value)}
            inputMode="numeric"
            placeholder="增减"
          />
          <button
            className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50"
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
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#8b7355]">&#x1F511; 当前余额：</span>
          <span className="text-xl font-extrabold text-amber-600">{currentBalance}</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = { id: string; username: string };
type Box = { id: string; status: string; createdAt: string };

export function AdminAssignBoxes(props: { sUsers: User[] }) {
  const [sUserId, setSUserId] = useState(props.sUsers[0]?.id ?? "");
  const [count, setCount] = useState("1");
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadBoxes(nextUserId: string) {
    if (!nextUserId) return setBoxes([]);
    const res = await fetch(`/api/admin/s-users/${nextUserId}/boxes`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error ?? "加载失败");
    const list = Array.isArray(data?.boxes) ? data.boxes : [];
    setBoxes(
      list.map((b: any) => ({
        id: b.id,
        status: b.status,
        createdAt: b.createdAt,
      })),
    );
  }

  useEffect(() => {
    setError(null);
    loadBoxes(sUserId).catch((e) => setError(e.message ?? "加载失败"));
  }, [sUserId]);

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="rounded border p-3 space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select className="rounded border p-2 flex-1" value={sUserId} onChange={(e) => setSUserId(e.target.value)}>
            {props.sUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
          <input
            className="rounded border p-2 w-full sm:w-32"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            inputMode="numeric"
            placeholder="数量"
          />
          <button
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            disabled={!sUserId || loading}
            onClick={async () => {
              setError(null);
              setLoading(true);
              try {
                const res = await fetch(`/api/admin/s-users/${sUserId}/boxes`, {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ count }),
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) return setError(data?.error ?? "分配失败");
                await loadBoxes(sUserId);
              } finally {
                setLoading(false);
              }
            }}
          >
            分配宝箱
          </button>
        </div>
        <div className="text-sm text-zinc-600">给该 S 增加 N 个宝箱（初始为 DRAFT）。</div>
      </div>

      <div className="space-y-2">
        <h2 className="font-semibold">宝箱列表</h2>
        {boxes.length === 0 ? (
          <p className="text-sm text-zinc-600">暂无宝箱</p>
        ) : (
          boxes.map((b, idx) => (
            <div key={b.id} className="rounded border p-3 flex items-center justify-between">
              <div className="min-w-0">
                <div className="font-medium">
                  #{idx + 1} <span className="text-sm text-zinc-600">{b.status}</span>
                </div>
                <div className="text-sm text-zinc-600">{new Date(b.createdAt).toLocaleString("zh-CN")}</div>
              </div>
              <Link className="text-sm underline" href={`/admin/boxes/${b.id}`}>
                查看/编辑
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


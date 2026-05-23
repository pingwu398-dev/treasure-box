"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = { id: string; username: string };
type Box = { id: string; status: string; createdAt: string };

const statusBadge = (s: string) => {
  if (s === "OPENED") return "已开";
  if (s === "READY") return "就绪";
  return "草稿";
};
const statusStyle = (s: string) => {
  if (s === "OPENED") return "bg-slate-100 text-slate-600";
  if (s === "READY") return "bg-emerald-50 text-emerald-700";
  return "bg-amber-50 text-amber-700";
};

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
    <div className="space-y-5">
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      <div className="rounded-2xl border border-amber-200/40 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            className="rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm flex-1"
            value={sUserId}
            onChange={(e) => setSUserId(e.target.value)}
          >
            {props.sUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
          <input
            className="rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm w-full sm:w-24"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            inputMode="numeric"
            placeholder="数量"
          />
          <button
            className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50"
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
        <p className="text-xs text-[#8b7355]">给该 S 增加 N 个宝箱（初始为草稿状态）。</p>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-[#5c3d1e]">宝箱列表</h2>
        {boxes.length === 0 ? (
          <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 px-5 py-8 text-center">
            <div className="text-3xl mb-2">&#x1F4ED;</div>
            <p className="text-sm text-amber-800">暂无宝箱</p>
          </div>
        ) : (
          boxes.map((b, idx) => (
            <div
              key={b.id}
              className="flex items-center justify-between rounded-2xl border border-amber-200/40 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-lg font-bold text-amber-600">
                  {idx + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#5c3d1e]">#{idx + 1}</span>
                    <span className={`rounded-full px-2 py-0 text-xs font-medium ${statusStyle(b.status)}`}>
                      {statusBadge(b.status)}
                    </span>
                  </div>
                  <div className="text-xs text-[#8b7355] mt-0.5">
                    {new Date(b.createdAt).toLocaleString("zh-CN")}
                  </div>
                </div>
              </div>
              <Link
                href={`/admin/boxes/${b.id}`}
                className="rounded-xl border border-amber-300 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-50"
              >
                查看
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

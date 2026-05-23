"use client";

import { useEffect, useState } from "react";

type Row = { id: string; username: string; value: number };

export function Leaderboard(props: { type: "S" | "M" }) {
  const [list, setList] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/public/leaderboard?type=${props.type}`)
      .then((r) => r.json())
      .then((d) => {
        const raw = Array.isArray(d?.list) ? d.list : [];
        setList(
          raw.map((u: any) => ({
            id: u.id,
            username: u.username,
            value: props.type === "M" ? u.keyBalance : u.boxCount,
          })),
        );
      })
      .finally(() => setLoading(false));
  }, [props.type]);

  const medal = (i: number) => (i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "");
  const label = props.type === "M" ? "🔑 钥匙排行" : "📦 宝箱排行";

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-stone-200/60 space-y-3">
      <h2 className="text-lg font-extrabold text-stone-800">{label}</h2>
      {loading && <p className="text-base text-stone-500">加载中…</p>}
      {!loading && list.length === 0 && <p className="text-base text-stone-500">暂无数据</p>}
      {list.map((u, i) => (
        <div key={u.id} className="flex items-center justify-between py-1.5 border-b border-stone-100 last:border-0">
          <div className="flex items-center gap-3">
            <span className="w-7 text-center text-lg">{medal(i) || i + 1}</span>
            <span className="text-base font-semibold text-stone-800">{u.username}</span>
          </div>
          <span className="text-lg font-extrabold text-stone-600">
            {props.type === "M" ? `${u.value}` : `${u.value} 个`}
          </span>
        </div>
      ))}
    </div>
  );
}

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
        setList(raw.map((u: any) => ({
          id: u.id,
          username: u.username,
          value: props.type === "M" ? u.cumulativeKeys : u.boxCount,
        })));
      })
      .finally(() => setLoading(false));
  }, [props.type]);

  const badge = (i: number) => i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "";
  const label = props.type === "M" ? "🔑 累计钥匙" : "📦 宝箱";

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm border border-[var(--border-light)]">
      <h2 className="mb-3 text-sm font-bold text-[var(--text)]">{label}</h2>
      {loading && <div className="flex items-center justify-center py-6 text-xs text-[var(--text-light)]">加载中…</div>}
      {!loading && list.length === 0 && <div className="flex items-center justify-center py-6 text-xs text-[var(--text-light)]">暂无数据</div>}
      <div className="space-y-1">
        {list.map((u, i) => (
          <div key={u.id} className={`flex items-center rounded-lg px-2 py-2 transition hover:bg-[var(--bg)] animate-fade-up stagger-${Math.min(i + 1, 6)}`}>
            <span className="flex w-7 items-center justify-center text-xs font-bold text-[var(--text-muted)]">{badge(i) || i + 1}</span>
            <span className="flex-1 text-xs font-semibold text-[var(--text)]">{u.username}</span>
            <span className="text-xs font-extrabold text-[var(--gold)]">
              {props.type === "M" ? `${u.value}` : `${u.value} 个`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

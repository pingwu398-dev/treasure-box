"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Item = { id: string; username: string };

export function SUserSearch() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams();
    if (query.trim()) params.set("query", query.trim());
    fetch(`/api/public/s-users?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => { if (cancelled) return; setItems(Array.isArray(d?.users) ? d.users : []); })
      .finally(() => { if (cancelled) return; setLoading(false); });
    return () => { cancelled = true; };
  }, [query]);

  return (
    <div className="space-y-2.5">
      <div className="relative">
        <input
          className="input px-4 py-5 pl-[38px] text-sm"
          placeholder="搜索写宝箱的人…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm">🔍</span>
      </div>
      <div className="space-y-2">
        {loading && <div className="flex items-center justify-center rounded-xl bg-white px-4 py-8 text-xs text-[var(--text-light)]">搜索中…</div>}
        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center rounded-xl bg-white px-4 py-8 text-xs text-[var(--text-light)]">
            {query ? "没有找到用户" : "还没有写宝箱的用户"}
          </div>
        )}
        {items.map((u, i) => (
          <div key={u.id} className={`flex items-center justify-between rounded-xl bg-white p-3.5 shadow-sm border border-[var(--border-light)] animate-fade-up stagger-${Math.min(i + 1, 6)}`}>
            <span className="text-sm font-semibold text-[var(--text)] truncate">{u.username}</span>
            <Link
              href={`/m/s/${u.id}`}
              className="btn btn-primary touch-btn shrink-0 rounded-xl px-4 py-2 text-xs font-bold"
            >
              查看宝箱
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

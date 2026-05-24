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
    fetch(`/api/public/s-users?query=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((d) => { if (cancelled) return; setItems(Array.isArray(d?.users) ? d.users : []); })
      .finally(() => { if (cancelled) return; setLoading(false); });
    return () => { cancelled = true; };
  }, [query]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
        <input
          className="w-full rounded-2xl border border-[var(--border)] bg-white py-3.5 pl-12 pr-4 text-base text-[var(--text)] placeholder-[var(--text-light)] outline-none transition focus:border-[var(--gold)] focus:ring-4 focus:ring-[var(--gold-glow)]"
          placeholder="搜索用户名"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        {loading && <div className="flex items-center justify-center rounded-2xl bg-white px-6 py-10 text-sm text-[var(--text-muted)]">🔍 搜索中…</div>}
        {!loading && query && items.length === 0 && <div className="flex items-center justify-center rounded-2xl bg-white px-6 py-10 text-sm text-[var(--text-muted)]">没有匹配的用户</div>}
        {items.map((u, i) => (
          <div key={u.id} className={`flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-[var(--border-light)] animate-fade-up stagger-${Math.min(i + 1, 6)}`}>
            <span className="text-base font-bold text-[var(--text)]">{u.username}</span>
            <Link href={`/m/s/${u.id}`} className="btn-gold rounded-xl px-5 py-2.5 text-sm">
              查看宝箱
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

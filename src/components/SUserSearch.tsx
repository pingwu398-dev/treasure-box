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
    <div className="space-y-4">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
        <input
          className="w-full rounded-2xl border border-stone-200 bg-white py-4 pl-12 pr-4 text-lg text-stone-800 placeholder-stone-400 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
          placeholder="搜索用户名"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="space-y-3">
        {loading && <div className="rounded-xl bg-white px-6 py-8 text-center text-lg text-stone-500">🔍 搜索中…</div>}
        {!loading && query && items.length === 0 && <div className="rounded-xl bg-white px-6 py-8 text-center text-lg text-stone-500">没有匹配的用户</div>}
        {items.map((u) => (
          <div key={u.id} className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm border border-stone-200/60">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-xl font-bold text-amber-700">
                {u.username.charAt(0)}
              </div>
              <span className="text-lg font-bold text-stone-800">{u.username}</span>
            </div>
            <Link href={`/m/s/${u.id}`} className="rounded-xl bg-[#e69a28] px-6 py-3 text-base font-bold text-white active:bg-[#c47a10]">
              查看宝箱
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

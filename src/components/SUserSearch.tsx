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
      .then((d) => {
        if (cancelled) return;
        setItems(Array.isArray(d?.users) ? d.users : []);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">&#x1F50D;</span>
        <input
          className="w-full rounded-2xl border border-amber-200/60 bg-white py-3 pl-10 pr-4 text-sm text-[#3d2b1f] placeholder-[#c4b49a] outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
          placeholder="搜索 S 用户名"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        {loading && (
          <div className="rounded-xl bg-amber-50/60 px-4 py-6 text-center text-sm text-amber-700">
            &#x1F50D; 搜索中…
          </div>
        )}
        {!loading && query && items.length === 0 && (
          <div className="rounded-xl bg-amber-50/60 px-4 py-6 text-center text-sm text-amber-700">
            没有匹配的用户
          </div>
        )}
        {items.map((u) => (
          <div
            key={u.id}
            className="flex items-center justify-between rounded-2xl border border-amber-200/40 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                {u.username.charAt(0)}
              </div>
              <span className="font-semibold text-[#5c3d1e]">{u.username}</span>
            </div>
            <Link
              href={`/m/s/${u.id}`}
              className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              查看宝箱
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

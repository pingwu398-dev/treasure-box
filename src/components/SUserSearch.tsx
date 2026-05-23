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
      <input
        className="w-full rounded border p-2"
        placeholder="搜索 S 用户"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="space-y-2">
        {loading && <p className="text-sm text-zinc-600">加载中...</p>}
        {!loading && items.length === 0 && <p className="text-sm text-zinc-600">没有匹配的 S 用户</p>}
        {items.map((u) => (
          <div key={u.id} className="rounded border p-3 flex items-center justify-between">
            <div className="font-medium">{u.username}</div>
            <Link className="text-sm underline" href={`/m/s/${u.id}`}>
              查看宝箱
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}


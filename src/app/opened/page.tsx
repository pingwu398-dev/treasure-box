"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Box = {
  id: string; openedAt: string; contentSnapshotAtOpen: string | null;
  ownerSUser: { username: string } | null;
  openedByMUser: { username: string } | null;
};

export default function OpenedFeedPage() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState(true);
  const [ownerQuery, setOwnerQuery] = useState("");
  const [openerQuery, setOpenerQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (ownerQuery.trim()) params.set("ownerUsername", ownerQuery.trim());
    if (openerQuery.trim()) params.set("openerUsername", openerQuery.trim());
    fetch(`/api/public/opened?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => { setBoxes(Array.isArray(d?.boxes) ? d.boxes : []); })
      .finally(() => setLoading(false));
  }, [ownerQuery, openerQuery]);

  return (
    <div className="min-h-screen pb-4">
      <header className="sticky top-0 z-50 border-b border-stone-200/60 bg-[#f8f6f2]/95 backdrop-blur">
        <div className="flex items-center justify-between px-5 py-3">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-stone-800">宝箱</Link>
          <span className="text-base font-semibold text-stone-700">🎰 已开广场</span>
          <button onClick={async () => { await fetch("/api/logout", { method: "POST" }); window.location.href = "/login"; }} className="text-sm text-red-500">退出</button>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-5 py-5 space-y-4">
        <div className="flex gap-3">
          <input
            className="flex-1 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-lg text-stone-800 placeholder-stone-400 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            placeholder="🔍 S 用户名"
            value={ownerQuery}
            onChange={(e) => setOwnerQuery(e.target.value)}
          />
          <input
            className="flex-1 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-lg text-stone-800 placeholder-stone-400 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
            placeholder="🔑 M 用户名"
            value={openerQuery}
            onChange={(e) => setOpenerQuery(e.target.value)}
          />
        </div>
        {loading && <div className="text-center text-lg text-stone-500">加载中…</div>}
        {!loading && boxes.length === 0 && (
          <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm border border-stone-200/60">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-lg font-medium text-stone-700">暂无已开宝箱</p>
          </div>
        )}
        {boxes.map((b) => (
          <Link key={b.id} href={`/opened/${b.id}`} className="block rounded-2xl bg-white p-5 shadow-sm border border-stone-200/60 active:bg-stone-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-stone-800">{b.ownerSUser?.username ?? "-"} 的宝箱</div>
                <div className="mt-1 text-base text-stone-500">
                  由 {b.openedByMUser?.username ?? "-"} 打开
                </div>
              </div>
              <span className="text-amber-500 text-xl">➤</span>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}

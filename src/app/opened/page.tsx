"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";

type Box = {
  id: string; openedAt: string; contentSnapshotAtOpen: string | null;
  ownerSUser: { username: string } | null;
  openedByMUser: { username: string } | null;
};

export default function OpenedFeedPage() {
  const [me, setMe] = useState<{ role: "S" | "M" | "ADMIN"; username: string } | null>(null);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState(true);
  const [ownerQuery, setOwnerQuery] = useState("");
  const [openerQuery, setOpenerQuery] = useState("");

  useEffect(() => {
    fetch("/api/me").then((r) => r.json()).then((d) => { if (d?.ok && d?.user) setMe(d.user); });
  }, []);

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
    <div className="min-h-screen bg-[var(--bg)] pb-8">
      {me && <AppHeader role={me.role} username={me.username} title="已开广场" />}
      {!me && (
        <header className="sticky top-0 z-50 border-b border-[var(--border-light)] bg-[var(--bg)]/95 backdrop-blur-lg">
          <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-2.5">
            <span className="text-sm font-extrabold text-[var(--text)]">🎰 已开广场</span>
            <button onClick={async () => { await fetch("/api/logout", { method: "POST" }); window.location.href = "/login"; }} className="text-xs font-medium text-red-400">退出</button>
          </div>
        </header>
      )}
      <main className="mx-auto max-w-lg px-4 py-5 space-y-4">
        {/* Search */}
        <div className="flex gap-2">
          <input
            className="input flex-1 px-3 py-3 text-sm"
            placeholder="🔍 S 用户名"
            value={ownerQuery}
            onChange={(e) => setOwnerQuery(e.target.value)}
          />
          <input
            className="input flex-1 px-3 py-3 text-sm"
            placeholder="🔑 M 用户名"
            value={openerQuery}
            onChange={(e) => setOpenerQuery(e.target.value)}
          />
        </div>

        {/* List */}
        {loading && <div className="flex items-center justify-center py-10 text-xs text-[var(--text-light)]">加载中…</div>}
        {!loading && boxes.length === 0 && (
          <div className="flex flex-col items-center rounded-xl bg-white px-6 py-14 text-center shadow-sm border border-[var(--border-light)]">
            <div className="mb-3 text-5xl">📭</div>
            <p className="text-sm font-bold text-[var(--text)]">暂无已开宝箱</p>
          </div>
        )}
        <div className="space-y-2.5">
          {boxes.map((b, i) => (
            <Link key={b.id} href={`/opened/${b.id}`} className={`flex items-center justify-between rounded-xl bg-white p-3.5 shadow-sm border border-[var(--border-light)] transition hover:shadow-md active:scale-[0.99] animate-fade-up stagger-${Math.min(i + 1, 6)}`}>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[var(--text)]">{b.ownerSUser?.username ?? "-"} 的宝箱</div>
                <div className="mt-0.5 text-[11px] text-[var(--text-light)]">
                  由 {b.openedByMUser?.username ?? "-"} 打开
                </div>
              </div>
              <span className="text-base text-[var(--text-faint)] shrink-0 ml-2">›</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

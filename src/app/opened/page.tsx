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
          <div className="mx-auto flex max-w-lg items-center justify-between px-5 py-3">
            <span className="text-lg font-extrabold tracking-tight text-[var(--text)]">🎰 已开广场</span>
            <button onClick={async () => { await fetch("/api/logout", { method: "POST" }); window.location.href = "/login"; }} className="text-sm font-medium text-red-400">退出</button>
          </div>
        </header>
      )}
      <main className="mx-auto max-w-lg px-5 py-6 space-y-4">
        <div className="flex gap-3">
          <input
            className="flex-1 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-light)] outline-none transition focus:border-[var(--gold)] focus:ring-4 focus:ring-[var(--gold-glow)]"
            placeholder="🔍 S 用户名"
            value={ownerQuery}
            onChange={(e) => setOwnerQuery(e.target.value)}
          />
          <input
            className="flex-1 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-light)] outline-none transition focus:border-[var(--gold)] focus:ring-4 focus:ring-[var(--gold-glow)]"
            placeholder="🔑 M 用户名"
            value={openerQuery}
            onChange={(e) => setOpenerQuery(e.target.value)}
          />
        </div>
        {loading && <div className="flex items-center justify-center py-10 text-sm text-[var(--text-muted)]">加载中…</div>}
        {!loading && boxes.length === 0 && (
          <div className="flex flex-col items-center rounded-3xl bg-white px-6 py-16 text-center shadow-sm border border-[var(--border-light)]">
            <div className="mb-4 text-6xl">📭</div>
            <p className="text-lg font-bold text-[var(--text)]">暂无已开宝箱</p>
          </div>
        )}
        {boxes.map((b, i) => (
          <Link key={b.id} href={`/opened/${b.id}`} className={`block rounded-2xl bg-white p-5 shadow-sm border border-[var(--border-light)] transition hover:shadow-md hover:border-[var(--border)] animate-fade-up stagger-${Math.min(i + 1, 6)}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-bold text-[var(--text)]">{b.ownerSUser?.username ?? "-"} 的宝箱</div>
                <div className="mt-1 text-sm text-[var(--text-muted)]">
                  由 {b.openedByMUser?.username ?? "-"} 打开
                </div>
              </div>
              <span className="text-lg text-[var(--gold)]">➤</span>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}

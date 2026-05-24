"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Box = { id: string; createdAt: string };

export function OpenBoxList(props: { boxes: Box[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = async (b: Box) => {
    setError(null); setLoadingId(b.id);
    try {
      const res = await fetch(`/api/m/boxes/${b.id}/open`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setError(data?.error ?? "开箱失败");
      router.push(`/m/open-result/${b.id}`); router.refresh();
    } finally { setLoadingId(null); }
  };

  return (
    <div className="space-y-2.5">
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-center text-xs font-medium text-red-500">{error}</div>}
      {props.boxes.map((b, idx) => (
        <div key={b.id} className={`flex items-center justify-between rounded-xl bg-white p-3.5 shadow-sm border border-[var(--border-light)] animate-fade-up stagger-${Math.min(idx + 1, 6)}`}>
          <div className="min-w-0">
            <span className="text-sm font-semibold text-[var(--text)]">
              #{idx + 1} 宝箱
            </span>
            <span className="ml-2 text-[11px] text-[var(--text-light)]">
              {new Date(b.createdAt).toLocaleDateString("zh-CN")}
            </span>
          </div>
          <button
            disabled={loadingId !== null}
            className="btn btn-primary touch-btn shrink-0 rounded-xl px-4 py-2 text-xs disabled:opacity-50"
            onClick={() => handleOpen(b)}
          >{loadingId === b.id ? "…" : "✨ 打开"}</button>
        </div>
      ))}
    </div>
  );
}

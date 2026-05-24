"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Box = { id: string; createdAt: string };

export function OpenBoxList(props: { boxes: Box[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const action = async (b: Box) => {
    setError(null); setLoadingId(b.id);
    try {
      const res = await fetch(`/api/m/boxes/${b.id}/open`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setError(data?.error ?? "开箱失败");
      router.push(`/m/open-result/${b.id}`); router.refresh();
    } finally { setLoadingId(null); }
  };

  return (
    <div className="space-y-3">
      {error && <div className="rounded-2xl bg-red-50 px-5 py-4 text-center text-sm font-medium text-red-600">{error}</div>}
      {props.boxes.map((b, idx) => (
        <div key={b.id} className={`flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-[var(--border-light)] animate-fade-up stagger-${Math.min(idx + 1, 6)}`}>
          <span className="text-base font-bold text-[var(--text)]">
            {idx + 1} 宝箱  {new Date(b.createdAt).toLocaleDateString("zh-CN")}
          </span>
          <button
            disabled={loadingId !== null}
            className="btn-gold rounded-xl px-5 py-2.5 text-sm disabled:opacity-50"
            onClick={() => action(b)}
          >{loadingId === b.id ? "开启中…" : "✨ 打开"}</button>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Box = { id: string; createdAt: string };

export function OpenBoxList(props: { boxes: Box[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {props.boxes.map((b, idx) => (
        <div
          key={b.id}
          className="flex items-center justify-between gap-3 rounded-2xl border border-amber-200/40 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-lg font-bold text-amber-600">
              {idx + 1}
            </span>
            <div>
              <div className="font-semibold text-[#5c3d1e]">宝箱 #{idx + 1}</div>
              <div className="text-xs text-[#8b7355]">{new Date(b.createdAt).toLocaleDateString("zh-CN")}</div>
            </div>
          </div>
          <button
            className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 disabled:opacity-50"
            disabled={loadingId !== null}
            onClick={async () => {
              const ok = window.confirm("确认打开？将消耗 1 把钥匙");
              if (!ok) return;
              setError(null);
              setLoadingId(b.id);
              try {
                const res = await fetch(`/api/m/boxes/${b.id}/open`, { method: "POST" });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) return setError(data?.error ?? "开箱失败");
                router.push(`/m/open-result/${b.id}`);
                router.refresh();
              } finally {
                setLoadingId(null);
              }
            }}
          >
            {loadingId === b.id ? "开启中…" : "\u2728 打开宝箱"}
          </button>
        </div>
      ))}
    </div>
  );
}

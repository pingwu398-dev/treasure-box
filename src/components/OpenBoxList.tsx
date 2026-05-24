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
      {error && <div className="rounded-xl bg-red-50 px-5 py-4 text-base text-red-700">{error}</div>}
      {props.boxes.map((b, idx) => (
        <div key={b.id} className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm border border-stone-200/60">
          <span className="text-lg font-bold text-stone-800">
            {idx + 1} 宝箱  {new Date(b.createdAt).toLocaleDateString("zh-CN")}
          </span>
          <button
            disabled={loadingId !== null}
            className="rounded-xl bg-[#e69a28] px-6 py-3 text-base font-bold text-white active:bg-[#c47a10] disabled:opacity-50"
            onClick={async () => {
              if (!window.confirm("确认打开？将消耗 1 把钥匙")) return;
              setError(null); setLoadingId(b.id);
              try {
                const res = await fetch(`/api/m/boxes/${b.id}/open`, { method: "POST" });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) return setError(data?.error ?? "开箱失败");
                router.push(`/m/open-result/${b.id}`); router.refresh();
              } finally { setLoadingId(null); }
            }}
          >{loadingId === b.id ? "开启中…" : "✨ 打开"}</button>
        </div>
      ))}
    </div>
  );
}

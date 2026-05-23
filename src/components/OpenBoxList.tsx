"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Box = { id: string; createdAt: string };

export function OpenBoxList(props: { boxes: Box[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {props.boxes.map((b, idx) => (
        <div key={b.id} className="rounded border p-3 flex items-center justify-between gap-4">
          <div className="font-medium">宝箱 #{idx + 1}</div>
          <button
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
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
            打开
          </button>
        </div>
      ))}
    </div>
  );
}


"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function BoxEditor(props: { boxId: string; initialContentText: string }) {
  const router = useRouter();
  const [contentText, setContentText] = useState(props.initialContentText);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <textarea
        className="w-full min-h-[200px] rounded border p-2"
        placeholder="输入宝箱内容"
        value={contentText}
        onChange={(e) => setContentText(e.target.value)}
      />
      <div className="flex items-center gap-3">
        <button
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          disabled={saving}
          onClick={async () => {
            setError(null);
            setSaving(true);
            try {
              const res = await fetch(`/api/s/boxes/${props.boxId}`, {
                method: "PUT",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ contentText }),
              });
              const data = await res.json().catch(() => ({}));
              if (!res.ok) return setError(data?.error ?? "保存失败");
              router.replace("/s");
              router.refresh();
            } finally {
              setSaving(false);
            }
          }}
        >
          保存
        </button>
        <button className="text-sm underline" onClick={() => router.back()}>
          返回
        </button>
      </div>
    </div>
  );
}


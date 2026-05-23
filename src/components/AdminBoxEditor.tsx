"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminBoxEditor(props: { boxId: string; initialContentText: string; disabled: boolean }) {
  const router = useRouter();
  const [contentText, setContentText] = useState(props.initialContentText);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      <textarea
        className="w-full min-h-[200px] rounded-2xl border border-amber-200/60 bg-white p-4 text-sm text-[#3d2b1f] placeholder-[#c4b49a] outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100 disabled:bg-amber-50/50 disabled:text-[#8b7355]"
        disabled={props.disabled}
        placeholder="宝箱内容"
        value={contentText}
        onChange={(e) => setContentText(e.target.value)}
      />
      <div className="flex items-center gap-3">
        {!props.disabled && (
          <button
            className="rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 disabled:opacity-50"
            disabled={saving}
            onClick={async () => {
              setError(null);
              setSaving(true);
              try {
                const res = await fetch(`/api/admin/boxes/${props.boxId}`, {
                  method: "PUT",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ contentText }),
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) return setError(data?.error ?? "保存失败");
                router.refresh();
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? "保存中…" : "保存内容"}
          </button>
        )}
        <button
          className="rounded-xl border border-amber-300 px-5 py-3 text-sm font-medium text-amber-700 transition hover:bg-amber-50"
          onClick={() => router.back()}
        >
          返回
        </button>
      </div>
    </div>
  );
}

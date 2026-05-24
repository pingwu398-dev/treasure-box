"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminBoxEditor(props: { boxId: string; initialContentText: string; disabled: boolean }) {
  const router = useRouter();
  const [contentText, setContentText] = useState(props.initialContentText);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function getBoxId() {
    const segments = window.location.pathname.split("/").filter(Boolean);
    return segments.pop() ?? props.boxId;
  }

  return (
    <div className="space-y-5">
      {error && <div className="rounded-xl bg-red-50 px-5 py-4 text-base text-red-700">{error}</div>}
      <textarea
        className="w-full min-h-[220px] rounded-2xl border border-stone-200 bg-white p-5 text-lg leading-relaxed text-stone-800 placeholder-stone-400 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 disabled:bg-stone-50/50 disabled:text-stone-500"
        disabled={props.disabled}
        placeholder="宝箱内容"
        value={contentText}
        onChange={(e) => setContentText(e.target.value)}
      />
      <div className="flex gap-3">
        {!props.disabled && (
          <button
            disabled={saving}
            className="flex-1 rounded-2xl bg-[#e69a28] py-4 text-lg font-bold text-white active:bg-[#c47a10] disabled:opacity-50"
            onClick={async () => { setError(null); setSaving(true); try { const id = getBoxId(); const res = await fetch(`/api/admin/boxes/${id}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ contentText }) }); const data = await res.json().catch(() => ({})); if (!res.ok) return setError(data?.error ?? "保存失败"); router.refresh(); } finally { setSaving(false); } }}
          >{saving ? "保存中…" : "保存"}</button>
        )}
        <button className="rounded-2xl border border-stone-300 px-6 py-4 text-lg font-medium text-stone-600 active:bg-stone-50" onClick={() => router.back()}>返回</button>
      </div>
    </div>
  );
}

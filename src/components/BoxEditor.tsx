"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function BoxEditor(props: { boxId: string; initialContentText: string }) {
  const router = useRouter();
  const [contentText, setContentText] = useState(props.initialContentText);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function getBoxId() {
    const segments = window.location.pathname.split("/").filter(Boolean);
    return segments.pop() ?? props.boxId;
  }

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const remaining = Math.max(0, 500 - contentText.length);

  return (
    <div className="space-y-4">
      {error && <div className="animate-scale-in rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-500">{error}</div>}
      <div className="relative">
        <textarea
          className="input p-4 min-h-[280px] resize-none leading-relaxed"
          placeholder="在这里写下宝箱里的秘密…"
          value={contentText}
          onChange={(e) => { setContentText(e.target.value); setDirty(true); }}
          maxLength={500}
        />
        <div className="mt-1.5 text-right text-[11px] text-[var(--text-light)]">
          {contentText.length}/500{remaining <= 20 && <span className="ml-1 text-red-400">剩余{remaining}字</span>}
        </div>
      </div>
      <div className="flex gap-2.5">
        <button
          disabled={saving}
          className="btn btn-primary flex-1 py-3.5 text-sm font-bold tracking-wide disabled:opacity-50"
          onClick={async () => {
            setError(null); setSaving(true);
            try {
              const id = getBoxId();
              const res = await fetch(`/api/s/boxes/${id}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ contentText }) });
              const data = await res.json().catch(() => ({}));
              if (!res.ok) return setError(data?.error ?? "保存失败");
              setDirty(false);
              router.replace("/s"); router.refresh();
            } finally { setSaving(false); }
          }}
        >{saving ? "保存中…" : "✉ 保存"}</button>
        <button className="btn btn-secondary flex-1 py-3.5 text-sm font-medium" onClick={() => { if (dirty && !window.confirm("有未保存的内容，确定离开吗？")) return; router.back(); }}>
          返回
        </button>
      </div>
    </div>
  );
}

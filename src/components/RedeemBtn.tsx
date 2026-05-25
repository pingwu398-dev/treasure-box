"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export function RedeemBtn(props: { boxId: string }) {
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  return !done ? (
    <button
      disabled={loading}
      className="btn touch-btn rounded-xl px-4 py-2 text-xs font-bold text-white bg-red-500 hover:bg-red-600 border border-red-600 disabled:opacity-50"
      onClick={async () => {
        setLoading(true);
        const res = await fetch(`/api/s/boxes/${props.boxId}/redeem`, { method: "POST" });
        const data = await res.json().catch(() => ({}));
        setLoading(false);
        if (!res.ok) return alert(data?.error ?? "兑现失败");
        setDone(true);
        router.refresh();
      }}
    >{loading ? "…" : "兑现"}</button>
  ) : (
    <Link href={`/opened/${props.boxId}`} className="btn btn-secondary touch-btn rounded-xl px-4 py-2 text-xs">查看</Link>
  );
}

"use client";

import { useState } from "react";

type UserRow = {
  id: string; username: string; role: "S" | "M" | "ADMIN"; keyBalance: number; boxCount: number; createdAt: string;
};

const badge: Record<string, { label: string; cls: string }> = {
  S: { label: "S", cls: "bg-blue-50 text-blue-700" },
  M: { label: "M", cls: "bg-emerald-50 text-emerald-700" },
  ADMIN: { label: "管理员", cls: "bg-amber-50 text-amber-700" },
};

export function AdminUsersTable(props: { initialUsers: UserRow[] }) {
  const [users, setUsers] = useState<UserRow[]>(props.initialUsers);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = search.trim() ? users.filter((u) => u.username.includes(search.trim())) : users;

  async function reload() {
    const res = await fetch("/api/admin/users");
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error ?? "加载失败");
    setUsers(Array.isArray(data?.users) ? data.users : []);
  }
  function updateLocal(id: string, patch: Partial<UserRow>) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  }

  return (
    <div className="space-y-3">
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-xs font-medium text-red-500">{error}</div>}

      <div className="relative">
        <input
          className="input px-4 py-5 pl-[34px] text-sm"
          placeholder="搜索用户名…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs">🔍</span>
      </div>

      <div className="overflow-auto rounded-xl border border-[var(--border-light)] bg-white">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[var(--border-light)] bg-[var(--bg)]">
              <th className="p-2.5 text-left font-bold text-[var(--text-muted)]">用户</th>
              <th className="p-2.5 text-left font-bold text-[var(--text-muted)]">角色</th>
              <th className="p-2.5 text-center font-bold text-[var(--text-muted)]">📦</th>
              <th className="p-2.5 text-center font-bold text-[var(--text-muted)]">🔑</th>
              <th className="p-2.5 text-left font-bold text-[var(--text-muted)]">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <Row key={u.id} user={u} onChanged={async () => { try { setError(null); await reload(); } catch (e: any) { setError(e.message); } }} onError={(m) => setError(m)} onLocal={(p) => updateLocal(u.id, p)} />
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-xs text-[var(--text-muted)]">没有匹配的用户</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row(props: { user: UserRow; onChanged: () => Promise<void>; onError: (m: string) => void; onLocal: (p: Partial<UserRow>) => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [boxCount, setBoxCount] = useState("1");
  const [keyDelta, setKeyDelta] = useState("1");

  async function patch(body: any) {
    const res = await fetch(`/api/admin/users/${props.user.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error ?? "更新失败");
  }
  async function del() {
    const res = await fetch(`/api/admin/users/${props.user.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error ?? "删除失败");
  }
  async function assignBoxes() {
    const res = await fetch(`/api/admin/s-users/${props.user.id}/boxes`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ count: boxCount }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error ?? "分配失败");
  }
  async function assignKeys() {
    const res = await fetch(`/api/admin/m-users/${props.user.id}/keys`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ delta: keyDelta }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error ?? "分配失败");
    if (typeof data?.user?.keyBalance === "number") props.onLocal({ keyBalance: data.user.keyBalance });
  }

  const b = badge[props.user.role] ?? badge.S;

  return (
    <tr className="border-b border-[var(--border-light)] last:border-0">
      <td className="p-2.5 font-semibold text-[var(--text)] whitespace-nowrap">{props.user.username}</td>
      <td className="p-2.5"><span className={`badge text-[10px] ${b.cls}`}>{b.label}</span></td>
      <td className="p-2.5 text-center text-xs text-[var(--text-muted)]">{props.user.role === "S" ? props.user.boxCount : "-"}</td>
      <td className="p-2.5 text-center text-xs text-[var(--text-muted)]">{props.user.keyBalance}</td>
      <td className="p-2.5">
        <div className="flex flex-wrap items-center gap-1">
          <input className="w-16 rounded-lg border border-[var(--border-light)] p-1.5 text-[10px]" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="rounded-lg border border-[var(--border-light)] px-2 py-1.5 text-[10px] font-medium text-[var(--text-muted)] transition hover:bg-[var(--bg)] disabled:opacity-50" disabled={loading || password.length < 6} onClick={async () => { setLoading(true); try { await patch({ password }); setPassword(""); await props.onChanged(); } catch (e: any) { props.onError(e.message); } finally { setLoading(false); } }}>重置</button>
          {props.user.role === "S" && (<><input className="w-10 rounded-lg border border-[var(--border-light)] p-1.5 text-[10px] text-center" value={boxCount} onChange={(e) => setBoxCount(e.target.value)} inputMode="numeric" /><button className="rounded-lg bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dark)] px-2 py-1.5 text-[10px] font-bold text-white disabled:opacity-50" disabled={loading} onClick={async () => { setLoading(true); try { await assignBoxes(); await props.onChanged(); } catch (e: any) { props.onError(e.message); } finally { setLoading(false); } }}>+宝箱</button></>)}
          {props.user.role === "M" && (<><input className="w-12 rounded-lg border border-[var(--border-light)] p-1.5 text-[10px] text-center" value={keyDelta} onChange={(e) => setKeyDelta(e.target.value)} inputMode="numeric" /><button className="rounded-lg bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dark)] px-2 py-1.5 text-[10px] font-bold text-white disabled:opacity-50" disabled={loading} onClick={async () => { setLoading(true); try { await assignKeys(); await props.onChanged(); } catch (e: any) { props.onError(e.message); } finally { setLoading(false); } }}>钥匙</button></>)}
          <button className="rounded-lg bg-red-50 px-2 py-1.5 text-[10px] font-medium text-red-400 transition hover:bg-red-100 disabled:opacity-50" disabled={loading} onClick={async () => { if (!window.confirm("确认删除？")) return; setLoading(true); try { await del(); await props.onChanged(); } catch (e: any) { props.onError(e.message); } finally { setLoading(false); } }}>删除</button>
        </div>
      </td>
    </tr>
  );
}

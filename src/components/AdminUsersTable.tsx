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
      {error && <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm font-medium text-red-600">{error}</div>}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm">🔍</span>
        <input
          className="w-full rounded-2xl border border-[var(--border)] bg-white py-3.5 pl-10 pr-4 text-sm text-[var(--text)] placeholder-[var(--text-light)] outline-none transition focus:border-[var(--gold)] focus:ring-4 focus:ring-[var(--gold-glow)]"
          placeholder="搜索用户名"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-auto rounded-2xl border border-[var(--border-light)] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-light)] bg-[var(--bg)]">
              <th className="p-3 text-left font-bold text-[var(--text-muted)]">用户名</th>
              <th className="p-3 text-left font-bold text-[var(--text-muted)]">角色</th>
              <th className="p-3 text-left font-bold text-[var(--text-muted)]">宝箱</th>
              <th className="p-3 text-left font-bold text-[var(--text-muted)]">钥匙</th>
              <th className="p-3 text-left font-bold text-[var(--text-muted)]">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <Row key={u.id} user={u} onChanged={async () => { try { setError(null); await reload(); } catch (e: any) { setError(e.message); } }} onError={(m) => setError(m)} onLocal={(p) => updateLocal(u.id, p)} />
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-sm text-[var(--text-muted)]">没有匹配的用户</td></tr>
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
      <td className="p-3 font-bold text-[var(--text)] whitespace-nowrap">{props.user.username}</td>
      <td className="p-3"><span className={`badge ${b.cls}`}>{b.label}</span></td>
      <td className="p-3 text-sm text-[var(--text-muted)]">{props.user.role === "S" ? props.user.boxCount : "-"}</td>
      <td className="p-3 text-sm text-[var(--text-muted)]">{props.user.keyBalance}</td>
      <td className="p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <input className="w-20 rounded-xl border border-[var(--border-light)] p-2 text-xs" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="rounded-xl border border-[var(--border-light)] px-3 py-2 text-xs font-medium text-[var(--text-muted)] transition hover:bg-[var(--bg)] disabled:opacity-50" disabled={loading || password.length < 6} onClick={async () => { setLoading(true); try { await patch({ password }); setPassword(""); await props.onChanged(); } catch (e: any) { props.onError(e.message); } finally { setLoading(false); } }}>重置</button>
          {props.user.role === "S" && (<><input className="w-12 rounded-xl border border-[var(--border-light)] p-2 text-xs text-center" value={boxCount} onChange={(e) => setBoxCount(e.target.value)} inputMode="numeric" /><button className="rounded-xl bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dark)] px-3 py-2 text-xs font-bold text-white disabled:opacity-50" disabled={loading} onClick={async () => { setLoading(true); try { await assignBoxes(); await props.onChanged(); } catch (e: any) { props.onError(e.message); } finally { setLoading(false); } }}>+宝箱</button></>)}
          {props.user.role === "M" && (<><input className="w-14 rounded-xl border border-[var(--border-light)] p-2 text-xs text-center" value={keyDelta} onChange={(e) => setKeyDelta(e.target.value)} inputMode="numeric" /><button className="rounded-xl bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dark)] px-3 py-2 text-xs font-bold text-white disabled:opacity-50" disabled={loading} onClick={async () => { setLoading(true); try { await assignKeys(); await props.onChanged(); } catch (e: any) { props.onError(e.message); } finally { setLoading(false); } }}>钥匙</button></>)}
          <button className="rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-500 transition hover:bg-red-100 disabled:opacity-50" disabled={loading} onClick={async () => { if (!window.confirm("确认删除？")) return; setLoading(true); try { await del(); await props.onChanged(); } catch (e: any) { props.onError(e.message); } finally { setLoading(false); } }}>删除</button>
        </div>
      </td>
    </tr>
  );
}

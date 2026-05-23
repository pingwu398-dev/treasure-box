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
      {error && <div className="rounded-xl bg-red-50 px-5 py-4 text-base text-red-700">{error}</div>}
      <div className="overflow-auto rounded-2xl border border-stone-200">
        <table className="w-full text-base">
          <thead className="bg-stone-50">
            <tr>
              <th className="p-3 text-left font-semibold text-stone-600">用户名</th>
              <th className="p-3 text-left font-semibold text-stone-600">角色</th>
              <th className="p-3 text-left font-semibold text-stone-600">宝箱</th>
              <th className="p-3 text-left font-semibold text-stone-600">钥匙</th>
              <th className="p-3 text-left font-semibold text-stone-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => <Row key={u.id} user={u} onChanged={async () => { try { setError(null); await reload(); } catch (e: any) { setError(e.message); } }} onError={(m) => setError(m)} onLocal={(p) => updateLocal(u.id, p)} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row(props: { user: UserRow; onChanged: () => Promise<void>; onError: (m: string) => void; onLocal: (p: Partial<UserRow>) => void }) {
  const [role, setRole] = useState(props.user.role);
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
    <tr className="border-t border-stone-100">
      <td className="p-3 font-semibold text-stone-800 whitespace-nowrap">{props.user.username}</td>
      <td className="p-3"><span className={`rounded-full px-2.5 py-1 text-sm font-medium ${b.cls}`}>{b.label}</span></td>
      <td className="p-3 text-stone-600">{props.user.role === "S" ? props.user.boxCount : "-"}</td>
      <td className="p-3 text-stone-600">{props.user.keyBalance}</td>
      <td className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          <select className="rounded-lg border border-stone-200 p-2 text-sm" value={role} onChange={(e) => setRole(e.target.value as any)}>
            <option value="S">S</option><option value="M">M</option><option value="ADMIN">管理员</option>
          </select>
          <button className="rounded-lg bg-stone-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-50" disabled={loading} onClick={async () => { setLoading(true); try { await patch({ role }); await props.onChanged(); } catch (e: any) { props.onError(e.message); } finally { setLoading(false); } }}>角色</button>
          <input className="w-20 rounded-lg border border-stone-200 p-2 text-sm" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-600 disabled:opacity-50" disabled={loading || password.length < 6} onClick={async () => { setLoading(true); try { await patch({ password }); setPassword(""); await props.onChanged(); } catch (e: any) { props.onError(e.message); } finally { setLoading(false); } }}>重置</button>
          {props.user.role === "S" && (<><input className="w-14 rounded-lg border border-stone-200 p-2 text-sm text-center" value={boxCount} onChange={(e) => setBoxCount(e.target.value)} inputMode="numeric" /><button className="rounded-lg bg-[#e69a28] px-3 py-2 text-sm font-medium text-white disabled:opacity-50" disabled={loading} onClick={async () => { setLoading(true); try { await assignBoxes(); await props.onChanged(); } catch (e: any) { props.onError(e.message); } finally { setLoading(false); } }}>+宝箱</button></>)}
          {props.user.role === "M" && (<><input className="w-16 rounded-lg border border-stone-200 p-2 text-sm text-center" value={keyDelta} onChange={(e) => setKeyDelta(e.target.value)} inputMode="numeric" /><button className="rounded-lg bg-[#e69a28] px-3 py-2 text-sm font-medium text-white disabled:opacity-50" disabled={loading} onClick={async () => { setLoading(true); try { await assignKeys(); await props.onChanged(); } catch (e: any) { props.onError(e.message); } finally { setLoading(false); } }}>钥匙</button></>)}
          <button className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 disabled:opacity-50" disabled={loading} onClick={async () => { if (!window.confirm("确认删除？")) return; setLoading(true); try { await del(); await props.onChanged(); } catch (e: any) { props.onError(e.message); } finally { setLoading(false); } }}>删除</button>
        </div>
      </td>
    </tr>
  );
}

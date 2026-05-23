"use client";

import { useState } from "react";

type UserRow = {
  id: string;
  username: string;
  role: "S" | "M" | "ADMIN";
  keyBalance: number;
  createdAt: string;
};

const roleBadge: Record<string, { label: string; cls: string }> = {
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
      {error && (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}
      <div className="overflow-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="p-2 text-left">用户名</th>
              <th className="p-2 text-left">角色</th>
              <th className="p-2 text-left">钥匙</th>
              <th className="p-2 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <UserRowItem
                key={u.id}
                user={u}
                onUserChanged={async () => { try { setError(null); await reload(); } catch (e: any) { setError(e.message); } }}
                onError={(msg) => setError(msg)}
                onLocalUpdate={(patch) => updateLocal(u.id, patch)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserRowItem(props: {
  user: UserRow;
  onUserChanged: () => Promise<void>;
  onError: (msg: string) => void;
  onLocalUpdate: (p: Partial<UserRow>) => void;
}) {
  const [role, setRole] = useState<UserRow["role"]>(props.user.role);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [boxCount, setBoxCount] = useState("1");
  const [keyDelta, setKeyDelta] = useState("1");

  async function patch(body: any) {
    const res = await fetch(`/api/admin/users/${props.user.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error ?? "更新失败");
  }

  async function del() {
    const res = await fetch(`/api/admin/users/${props.user.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error ?? "删除失败");
  }

  async function assignBoxes() {
    const res = await fetch(`/api/admin/s-users/${props.user.id}/boxes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ count: boxCount }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error ?? "分配失败");
  }

  async function assignKeys() {
    const res = await fetch(`/api/admin/m-users/${props.user.id}/keys`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ delta: keyDelta }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error ?? "分配失败");
    const nextBalance = data?.user?.keyBalance;
    if (typeof nextBalance === "number") props.onLocalUpdate({ keyBalance: nextBalance });
  }

  const badge = roleBadge[props.user.role] ?? roleBadge.S;

  return (
    <tr className="border-t">
      <td className="p-2 whitespace-nowrap font-medium">{props.user.username}</td>
      <td className="p-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge.cls}`}>{badge.label}</span>
      </td>
      <td className="p-2">{props.user.keyBalance}</td>
      <td className="p-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <select className="rounded border p-1 text-xs" value={role} onChange={(e) => setRole(e.target.value as any)}>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="ADMIN">管理员</option>
          </select>
          <button
            className="rounded bg-zinc-800 px-2.5 py-1 text-xs text-white disabled:opacity-50"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              try { await patch({ role }); await props.onUserChanged(); } catch (e: any) { props.onError(e.message); } finally { setLoading(false); }
            }}
          >角色</button>

          <input className="w-24 rounded border p-1 text-xs" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button
            className="rounded border px-2.5 py-1 text-xs disabled:opacity-50"
            disabled={loading || password.length < 6}
            onClick={async () => {
              setLoading(true);
              try { await patch({ password }); setPassword(""); await props.onUserChanged(); } catch (e: any) { props.onError(e.message); } finally { setLoading(false); }
            }}
          >重置</button>

          {props.user.role === "S" && (
            <>
              <input className="w-12 rounded border p-1 text-xs text-center" value={boxCount} onChange={(e) => setBoxCount(e.target.value)} inputMode="numeric" />
              <button
                className="rounded bg-amber-500 px-2.5 py-1 text-xs text-white disabled:opacity-50"
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  try { await assignBoxes(); await props.onUserChanged(); } catch (e: any) { props.onError(e.message); } finally { setLoading(false); }
                }}
              >+宝箱</button>
            </>
          )}

          {props.user.role === "M" && (
            <>
              <input className="w-16 rounded border p-1 text-xs text-center" value={keyDelta} onChange={(e) => setKeyDelta(e.target.value)} inputMode="numeric" />
              <button
                className="rounded bg-amber-500 px-2.5 py-1 text-xs text-white disabled:opacity-50"
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  try { await assignKeys(); await props.onUserChanged(); } catch (e: any) { props.onError(e.message); } finally { setLoading(false); }
                }}
              >钥匙</button>
            </>
          )}

          <button
            className="rounded border px-2.5 py-1 text-xs text-red-600 disabled:opacity-50"
            disabled={loading}
            onClick={async () => {
              if (!window.confirm("确认删除？")) return;
              setLoading(true);
              try { await del(); await props.onUserChanged(); } catch (e: any) { props.onError(e.message); } finally { setLoading(false); }
            }}
          >删除</button>
        </div>
      </td>
    </tr>
  );
}

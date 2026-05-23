"use client";

import { useState } from "react";

type UserRow = {
  id: string;
  username: string;
  role: "S" | "M" | "ADMIN";
  keyBalance: number;
  createdAt: string;
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

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}
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
                onChanged={async () => {
                  try {
                    setError(null);
                    await reload();
                  } catch (e: any) {
                    setError(e.message ?? "操作失败");
                  }
                }}
                onError={(msg) => setError(msg)}
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
  onChanged: () => Promise<void>;
  onError: (msg: string) => void;
}) {
  const [role, setRole] = useState<UserRow["role"]>(props.user.role);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <tr className="border-t">
      <td className="p-2 whitespace-nowrap">{props.user.username}</td>
      <td className="p-2">
        <select className="rounded border p-1" value={role} onChange={(e) => setRole(e.target.value as any)}>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </td>
      <td className="p-2">{props.user.keyBalance}</td>
      <td className="p-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="rounded bg-black px-3 py-1 text-white disabled:opacity-50"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              try {
                await patch({ role });
                await props.onChanged();
              } catch (e: any) {
                props.onError(e.message ?? "更新失败");
              } finally {
                setLoading(false);
              }
            }}
          >
            改角色
          </button>
          <input
            className="w-40 rounded border p-1"
            placeholder="重置密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="rounded border px-3 py-1 disabled:opacity-50"
            disabled={loading || password.length < 6}
            onClick={async () => {
              setLoading(true);
              try {
                await patch({ password });
                setPassword("");
                await props.onChanged();
              } catch (e: any) {
                props.onError(e.message ?? "更新失败");
              } finally {
                setLoading(false);
              }
            }}
          >
            重置
          </button>
          <button
            className="rounded border px-3 py-1 text-red-700 disabled:opacity-50"
            disabled={loading}
            onClick={async () => {
              const ok = window.confirm("确认删除该用户？");
              if (!ok) return;
              setLoading(true);
              try {
                await del();
                await props.onChanged();
              } catch (e: any) {
                props.onError(e.message ?? "删除失败");
              } finally {
                setLoading(false);
              }
            }}
          >
            删除
          </button>
        </div>
      </td>
    </tr>
  );
}


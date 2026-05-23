"use client";

import { useState } from "react";

type UserRow = {
  id: string;
  username: string;
  role: "S" | "M" | "ADMIN";
  keyBalance: number;
  createdAt: string;
};

const roleLabel: Record<string, string> = { S: "S", M: "M", ADMIN: "管理员" };
const roleColor: Record<string, string> = {
  S: "bg-blue-50 text-blue-700",
  M: "bg-emerald-50 text-emerald-700",
  ADMIN: "bg-amber-50 text-amber-700",
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
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      <div className="space-y-2">
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
  const [open, setOpen] = useState(false);

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
    <div className="rounded-2xl border border-amber-200/40 bg-white shadow-sm overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-amber-50/50 transition"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
            {props.user.username.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-[#5c3d1e] truncate">{props.user.username}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`rounded-full px-2 py-0 text-xs font-medium ${roleColor[props.user.role]}`}>
                {roleLabel[props.user.role]}
              </span>
              {props.user.role === "M" && (
                <span className="text-xs text-[#8b7355]">&#x1F511; {props.user.keyBalance}</span>
              )}
            </div>
          </div>
        </div>
        <span className={`text-amber-400 transition ${open ? "rotate-180" : ""}`}>&#x25BC;</span>
      </div>
      {open && (
        <div className="border-t border-amber-100 px-4 py-3 space-y-3 bg-amber-50/30">
          <div className="flex flex-wrap items-center gap-2">
            <select
              className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
            >
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="ADMIN">管理员</option>
            </select>
            <button
              className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50"
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
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm w-36"
              placeholder="重置密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="rounded-xl border border-amber-300 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-50 disabled:opacity-50"
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
              重置密码
            </button>
          </div>
          <button
            className="rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
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
            删除用户
          </button>
        </div>
      )}
    </div>
  );
}

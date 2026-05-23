import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { ROLE, type Role } from "@/lib/roles";

export function requireUser(roles?: Role[]) {
  const session = getSession();
  if (!session) redirect("/login");
  if (roles && !roles.includes(session.role)) redirect("/");
  return session;
}

export function getHomeByRole(role: Role) {
  if (role === ROLE.S) return "/s";
  if (role === ROLE.M) return "/m";
  return "/admin";
}

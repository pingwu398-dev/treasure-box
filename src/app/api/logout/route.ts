import { NextResponse } from "next/server";
import { clearSession, getSession } from "@/lib/session";
import { auditLog } from "@/lib/audit";

export async function POST() {
  const session = getSession();
  clearSession();
  if (session) {
    await auditLog({
      actorUserId: session.userId,
      action: "LOGOUT",
      targetType: "USER",
      targetId: session.userId,
    });
  }
  return NextResponse.json({ ok: true });
}

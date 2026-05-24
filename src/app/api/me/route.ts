import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, user: { role: user.role, username: user.username } });
}

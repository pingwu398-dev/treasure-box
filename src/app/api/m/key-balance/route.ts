import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { ROLE } from "@/lib/roles";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  if (user.role !== ROLE.M) return NextResponse.json({ ok: false }, { status: 403 });
  return NextResponse.json({ ok: true, balance: user.keyBalance });
}


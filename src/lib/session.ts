import crypto from "crypto";
import { cookies } from "next/headers";
import { ROLE, type Role } from "@/lib/roles";

const COOKIE_NAME = "tb_session";
const SESSION_DAYS = 30;

type TokenPayload = {
  userId: string;
  role: Role;
  exp: number;
};

function base64UrlEncode(input: Buffer | string) {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecodeToBuffer(input: string) {
  const pad = 4 - (input.length % 4 || 4);
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad);
  return Buffer.from(base64, "base64");
}

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is missing");
  return secret;
}

function sign(data: string) {
  return base64UrlEncode(crypto.createHmac("sha256", getSecret()).update(data).digest());
}

function buildToken(payload: TokenPayload) {
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function verifyToken(token: string): TokenPayload | null {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;
  if (sign(encodedPayload) !== signature) return null;
  const decoded = base64UrlDecodeToBuffer(encodedPayload).toString("utf8");
  const payload = JSON.parse(decoded) as TokenPayload;
  if (!payload?.userId || !payload?.role || typeof payload.exp !== "number") return null;
  if (![ROLE.S, ROLE.M, ROLE.ADMIN].includes(payload.role)) return null;
  if (Date.now() > payload.exp) return null;
  return payload;
}

export function getSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  return { userId: payload.userId, role: payload.role };
}

export function setSession(user: { id: string; role: Role }) {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const token = buildToken({ userId: user.id, role: user.role, exp });
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(exp),
    path: "/",
  });
}

export function clearSession() {
  cookies().set(COOKIE_NAME, "", { httpOnly: true, path: "/", expires: new Date(0) });
}

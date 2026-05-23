import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export function GET() {
  cookies().set("tb_session", "", { httpOnly: true, path: "/", expires: new Date(0) });
  redirect("/login");
}

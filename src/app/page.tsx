import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getHomeByRole } from "@/lib/auth";

export default function Home() {
  const session = getSession();
  if (!session) redirect("/login");
  redirect(getHomeByRole(session.role));
}

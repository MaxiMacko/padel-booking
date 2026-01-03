import { redirect } from "next/navigation";

import { requireAuth } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireAuth(); // якщо не залогінений → редірект на /login

  if (user.role === "TRAINER") {
    redirect("/dashboard/trainer");
  }
  if (user.role === "CLIENT") {
    redirect("/dashboard/client");
  }
}

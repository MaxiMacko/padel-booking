import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser(); // якщо не залогінений → редірект на /login

  if (!user) {
    redirect("/login");
  }

  if (user.role === "TRAINER") {
    redirect("/dashboard/trainer");
  }
  if (user.role === "CLIENT") {
    redirect("/dashboard/client");
  }
}

import { getCurrentUser } from "@/lib/auth";
import { USER_TYPE } from "@/lib/types/types";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser(); // якщо не залогінений → редірект на /login

  if (!user) {
    redirect("/login");
  }

  if (user.role === USER_TYPE.TRAINER) {
    redirect("/dashboard/trainer");
  } else if (user.role === USER_TYPE.CLIENT) {
    redirect("/dashboard/client");
  } else {
    console.log("Unsupported role");
  }
}

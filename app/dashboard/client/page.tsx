import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ClientDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    console.log('no token!!!')
    redirect("/login");
  }

  let payload: { userId: string; role: string };
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
  } catch {
    console.log('client page')
    redirect("/login");
  }

  if (payload.role !== "CLIENT") {
    redirect("/dashboard/trainer/calendar");
  }

  // Завантажуємо профіль з Prisma
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        👋 Привіт{user?.name ? `, ${user.name}` : ""}!
      </h1>

      <ul className="space-y-2">
        <li>🎾 Знайти тренера</li>
        <li>📅 Мої тренування</li>
        <li>⚙️ Налаштування профілю</li>
      </ul>
    </div>
  );
}

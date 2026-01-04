
import { getCurrentUser } from "@/lib/auth";

export default async function ClientDashboardPage() {
  const user = await getCurrentUser();

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

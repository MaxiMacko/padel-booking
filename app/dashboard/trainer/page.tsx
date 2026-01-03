import { getCurrentUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function TrainerDashboard() {
  const user = await getCurrentUser();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        👋 Тренер, вітаю{user?.name ? `, ${user.name}` : ""}!
      </h1>

      <ul className="space-y-2">
        <li>📅 Управління розкладом</li>
        <li>📝 Мої бронювання</li>
        <li>⚙️ Налаштування профілю</li>
      </ul>
    </div>
  );
}

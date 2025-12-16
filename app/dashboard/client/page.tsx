import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ClientDashboard() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user!.id)
    .single();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        👋 Привіт{profile?.name ? `, ${profile.name}` : ""}!
      </h1>

      <ul className="space-y-2">
        <li>🎾 Знайти тренера</li>
        <li>📅 Мої тренування</li>
        <li>⚙️ Налаштування профілю</li>
      </ul>
    </div>
  );
}

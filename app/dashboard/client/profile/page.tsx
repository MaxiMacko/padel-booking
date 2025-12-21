import { createSupabaseServerClient } from "@/lib/supabase/server";
import ClientProfileForm from "./ClientProfileForm";

export default async function ClientProfilePage() {
  const supabase = await createSupabaseServerClient();

  // Отримуємо поточного user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <p>Not logged in</p>;

  // Спробуємо знайти профіль
  let { data: profile, error } = await supabase
    .from("profiles")
    .select("id, name, email, phone, role")
    .eq("id", user.id)
    .single();

  // Якщо профіль не знайдено — створюємо його автоматично
  if (!profile) {
    const { data: newProfile, error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email,
        name: "",
        phone: "",
        role: "client",
      })
      .select()
      .single();

    if (insertError) throw new Error("Cannot create profile: " + insertError.message);
    profile = newProfile;
  }

  return <ClientProfileForm initialProfile={profile!} userId={user.id} />;
}

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import TrainerSidebar from "@/app/commonComponents/trainer/TrainerSidebar";

export default async function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "trainer") {
    redirect("/dashboard/client/calendar");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <TrainerSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

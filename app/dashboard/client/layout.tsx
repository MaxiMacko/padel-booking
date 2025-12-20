import ClientSidebar from "@/app/commonComponents/client/ClientSidebar";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ClientLayout({
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

  if (profile?.role !== "client") {
    redirect("/dashboard/trainer/calendar");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ClientSidebar />

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}

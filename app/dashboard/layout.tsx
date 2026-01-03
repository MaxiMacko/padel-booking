import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LogoutButton } from "../commonComponents/logoutButton";
import { requireAuth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const user = await requireAuth(); // якщо не залогінений → редірект на /login


  if (!user) {
    redirect("/login");
  }


  const onLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-slate-100 text-black">
      <nav className="border-b px-6 py-4">
        <span className="font-bold">Padel Booking</span>
      </nav>

      <main className="p-6">{children}</main>
      <div>
        <LogoutButton />
      </div>
    </div>
  );
}

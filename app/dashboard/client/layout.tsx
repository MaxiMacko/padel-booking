
import { requireAuth } from "@/lib/auth";
import ClientSidebar from "@/app/commonComponents/client/ClientSidebar";
import { redirect } from "next/navigation";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth(); // якщо не залогінений → редірект на /login

  if (user.role !== "CLIENT") {
    redirect("/dashboard/trainer/calendar");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ClientSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

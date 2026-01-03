
import { getCurrentUser } from "@/lib/auth";
import ClientSidebar from "@/app/commonComponents/client/ClientSidebar";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role !== "CLIENT") redirect("/dashboard/trainer"); // або 403

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ClientSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

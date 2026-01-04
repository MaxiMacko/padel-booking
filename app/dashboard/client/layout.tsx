
import { requireRole } from "@/lib/auth";
import ClientSidebar from "@/app/commonComponents/client/ClientSidebar";


export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  await requireRole("CLIENT");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ClientSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

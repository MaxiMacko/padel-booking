
import { requireRole } from "@/lib/auth";
import ClientSidebar from "@/app/commonComponents/client/ClientSidebar";
import { USER_TYPE } from "@/lib/types/types";


export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  await requireRole(USER_TYPE.CLIENT);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ClientSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

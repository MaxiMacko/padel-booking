
import TrainerSidebar from "@/app/commonComponents/trainer/TrainerSidebar";
import { requireRole } from "@/lib/auth";
import { USER_TYPE } from "@/lib/types/types";

export default async function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(USER_TYPE.TRAINER);


  return (
    <div className="flex min-h-screen bg-gray-100">
      <TrainerSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

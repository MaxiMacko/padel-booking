import { redirect } from "next/navigation";
import TrainerSidebar from "@/app/commonComponents/trainer/TrainerSidebar";
import { getCurrentUser } from "@/lib/auth";

export default async function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role !== "TRAINER") redirect("/dashboard/client"); // або 403


  return (
    <div className="flex min-h-screen bg-gray-100">
      <TrainerSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

import ClientSidebar from "@/app/commonComponents/client/ClientSidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <ClientSidebar />

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}

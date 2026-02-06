import Sidebar from "../components/Sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 w-full overflow-y-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}

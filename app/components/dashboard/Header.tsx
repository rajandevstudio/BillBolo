export function DashboardHeader({ name, userId }: { name?: string; userId: string }) {
  return (
    <header className="flex justify-between items-center mb-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {name}</p>
      </div>

      <div className="bg-white px-4 py-2 rounded-lg shadow border text-sm">
        <span className="text-gray-500">Shop ID:</span>{" "}
        <span className="font-mono font-bold text-gray-500">{userId}</span>
      </div>
    </header>
  );
}

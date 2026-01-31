import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { Suspense } from "react";
import { formatINR, InvoiceTable, TableSkeleton } from "../components/TableContent";
import { KpiCard } from "../components/KPI";

export const revalidate = 30; // ISR caching

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const user = await currentUser();

  // Parallel DB queries (FAST)
  const [invoices, stats] = await Promise.all([
    prisma.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        invoiceNumber: true,
        customerName: true,
        totalAmount: true,
        createdAt: true,
      },
    }),

    prisma.invoice.aggregate({
      where: { userId },
      _sum: { totalAmount: true },
      _count: { id: true },
    }),
  ]);

  const totalRevenue = stats._sum.totalAmount ?? 0;
  const totalOrders = stats._count.id ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.firstName}</p>
        </div>

        <div className="bg-white px-4 py-2 rounded-lg shadow border text-sm">
          <span className="text-gray-500">Shop ID:</span>{" "}
          <span className="font-mono font-bold text-gray-500">{userId}</span>
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <KpiCard label="Total Revenue" value={formatINR(totalRevenue)} color="green" />
        <KpiCard label="Total Orders" value={totalOrders.toString()} color="blue" />
        <KpiCard label="Sync Status" value="Live" color="gray" />
      </div>

      {/* Table */}
      <Suspense fallback={<TableSkeleton />}>
        <InvoiceTable invoices={invoices} />
      </Suspense>
    </div>
  );
}

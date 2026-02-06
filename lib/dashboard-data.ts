import prisma from "@/lib/db";

export async function getDashboardData(userId: string) {
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

  return {
    invoices,
    totalRevenue: stats._sum.totalAmount ?? 0,
    totalOrders: stats._count.id ?? 0,
  };
}

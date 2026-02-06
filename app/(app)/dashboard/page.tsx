import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ensureUser } from "@/lib/user";
import { getDashboardData } from "@/lib/dashboard-data";
import { DashboardHeader } from "../../components/dashboard/Header";
import { KPIs } from "../../components/dashboard/Kpis";
import { InvoiceSection } from "../../components/dashboard/InvoiceSection";


export const revalidate = 30;

export default async function Dashboard() {
  const user = await ensureUser();

  if (!user) redirect("/");

  if (!user.phone) redirect("/onboarding");


  const { invoices, totalRevenue, totalOrders } =
    await getDashboardData(user.id);

  return (
    <>
      <DashboardHeader name={user.name} userId={user.id} />
      <KPIs totalRevenue={totalRevenue} totalOrders={totalOrders} />
      <InvoiceSection invoices={invoices} />
    </>
  );
}

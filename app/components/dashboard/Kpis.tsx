import { KpiCard } from "./KPI";
import { formatINR } from "./TableUtils";

export function KPIs({
  totalRevenue,
  totalOrders,
}: {
  totalRevenue: number;
  totalOrders: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <KpiCard label="Total Revenue" value={formatINR(totalRevenue)} color="green" />
      <KpiCard label="Total Orders" value={totalOrders.toString()} color="blue" />
      <KpiCard label="Sync Status" value="Live" color="gray" />
    </div>
  );
}

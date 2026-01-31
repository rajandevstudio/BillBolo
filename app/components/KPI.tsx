type KpiColor = "green" | "blue" | "gray";

export function KpiCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: KpiColor;
}) {
  const colors = {
    green: "border-green-500 text-green-600",
    blue: "border-blue-500 text-blue-600",
    gray: "border-gray-400 text-gray-600",
  };

  return (
    <div className={`bg-white p-6 rounded-xl shadow border-l-4 ${colors[color]}`}>
      <p className="text-xs uppercase text-gray-400">{label}</p>
      <h3 className="text-3xl font-bold mt-1">{value}</h3>
    </div>
  );
}



export function TableSkeleton() {
  return (
    <div className="bg-white p-6 rounded-xl shadow border animate-pulse h-40" />
  );
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

export function InvoiceTable({ invoices }: { invoices: any[] }) {
  return (
    <div className="bg-white rounded-xl shadow border overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-6 py-4">Invoice #</th>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4 text-right">Amount</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {invoices.map((inv) => (
            <tr key={inv.id} className="hover:bg-gray-50 text-gray-500">
              <td className="px-6 py-4 font-mono text-gray-500">{inv.invoiceNumber}</td>
              <td className="px-6 py-4 text-gray-500">{inv.customerName}</td>
              <td className="px-6 py-4 text-gray-500">
                {inv.createdAt.toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right font-bold">
                {formatINR(inv.totalAmount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

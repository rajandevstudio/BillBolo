export function TableSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow border animate-pulse h-40" />
  );
}

export function formatINR(amount: number) {
  if (!amount){
    return '0.00'
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}
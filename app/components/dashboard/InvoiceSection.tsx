import { Suspense } from "react";
import { InvoiceTable, TableSkeleton } from "./TableContent";

export function InvoiceSection({ invoices }: any) {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <InvoiceTable invoices={invoices} />
    </Suspense>
  );
}

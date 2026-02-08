import { Suspense } from "react";
import { InvoiceTable } from "./TableContent";
import { TableSkeleton } from "./TableUtils";

export function InvoiceSection({ invoices }: any) {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <InvoiceTable invoices={invoices} />
    </Suspense>
  );
}

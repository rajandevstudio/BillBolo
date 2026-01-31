
export interface InvoiceItem {
  description: string;
  qty: number;
  rate: number;
  amount?: number; // Optional because we calculate it here
}

export interface CalculatedInvoice {
  items: Array<Required<InvoiceItem>>;
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
  invoiceNum: string;
  dateStr: string;
}

/**
 * Processes raw items to calculate line totals, tax, and grand totals.
 * Uses a fixed 5% GST rate.
 */
export function calculateInvoiceTotals(rawItems: InvoiceItem[]): CalculatedInvoice {
  let subtotal = 0;
  
  // 1. Calculate line totals
  const processedItems = rawItems.map(item => {
    // Ensure we are working with numbers to prevent string concatenation
    const amount = (item.qty || 0) * (item.rate || 0);
    subtotal += amount;
    
    return { 
      ...item, 
      amount: amount 
    } as Required<InvoiceItem>;
  });

  // 2. Calculate Tax (5% GST)
  const taxPercent = 0.05; 
  const taxAmount = subtotal * taxPercent;
  
  // 3. Grand Total
  const grandTotal = subtotal + taxAmount;

  // 4. Generate Metadata
  const invoiceNum = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = new Date().toLocaleDateString('en-IN');

  return {
    items: processedItems,
    subtotal,
    taxAmount,
    grandTotal,
    invoiceNum,
    dateStr
  };
}
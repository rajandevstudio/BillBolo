// types/index.ts

export interface InvoiceItem {
  desc: string;
  qty: number;
  rate: number;
  amount?: number; // Optional because we calculate it later
}

export interface InvoiceExtraction {
  customer_name: string | null;
  items: InvoiceItem[];
}

export interface CalculatedInvoice {
  items: Required<InvoiceItem>[]; // 'amount' is now required
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
  invoiceNum: string;
  dateStr: string;
}

export interface ShopConfig {
  name: string;
  address: string;
  phone: string;
  gstin?: string;
}

// Define the shape of our Invoice data for TypeScript
export interface InvoiceWithDetails {
  id: string;
  invoiceNumber: string;
  customerName: string;
  createdAt: Date;
  status: string;
  totalAmount: number;
};  

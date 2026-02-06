

/* ================================
   After validation (Invoice layer)
================================= */
export interface ValidatedInvoiceItem {
  desc: string;
  qty: number;
  rate: number;
  amount: number;
}

/* ================================
   Shop configuration
================================= */
export interface ShopConfig {
  name: string;
  address: string;
  phone: string;
  gstin?: string;
}


export interface ExtractedInvoice {
  shop_name: string;
  customer_name: string;
  items: Array<{
    description: string; // Renamed 'desc' to 'description' to match your calculation lib
    qty: number;
    rate: number;
  }>;
}
export interface Product {
  id: string;
  name: string;
  description: string;
  quantity: string;
  rate: string;
  amount: number;
}

export interface BusinessDetails {
  name: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
}

export interface CustomerDetails {
  name: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
}

export type TaxMode = 'cgst_sgst' | 'igst';

export interface InvoiceSummaryData {
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  taxMode: TaxMode;
}

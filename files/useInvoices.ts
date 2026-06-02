import { useState } from 'react';
import { getDatabase } from '../database/db';
import { Product, BusinessDetails, CustomerDetails, TaxMode } from '../types/types';

export interface Invoice {
  id: number;
  invoice_number: string;
  invoice_date: string;
  business_name: string;
  business_address: string;
  business_phone: string;
  business_email: string;
  business_gstin: string;
  customer_name: string;
  customer_address: string;
  customer_phone: string;
  customer_email: string;
  customer_gstin: string;
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  tax_mode: TaxMode;
  total: number;
  created_at: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  name: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}-${random}`;
  };

  const saveInvoice = (
    business: BusinessDetails,
    customer: CustomerDetails,
    invoiceDate: string,
    products: Product[],
    subtotal: number,
    cgst: number,
    sgst: number,
    igst: number,
    total: number,
    taxMode: TaxMode
  ) => {
    try {
      const db = getDatabase();
      const invoiceNumber = generateInvoiceNumber();
      const createdAt = new Date().toISOString();

      const result = db.runSync(
        `INSERT INTO invoices (
          invoice_number, invoice_date,
          business_name, business_address, business_phone, business_email, business_gstin,
          customer_name, customer_address, customer_phone, customer_email, customer_gstin,
          subtotal, cgst, sgst, igst, tax_mode, total, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          invoiceNumber, invoiceDate,
          business.name, business.address, business.phone, business.email, business.gstin,
          customer.name, customer.address, customer.phone, customer.email, customer.gstin,
          subtotal, cgst, sgst, igst, taxMode, total, createdAt,
        ]
      );

      const invoiceId = result.lastInsertRowId;

      products.forEach((product) => {
        db.runSync(
          `INSERT INTO invoice_items (invoice_id, name, description, quantity, rate, amount)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [invoiceId, product.name, product.description, parseFloat(product.quantity) || 0, parseFloat(product.rate) || 0, product.amount]
        );
      });

      return invoiceNumber;
    } catch (error) {
      console.error('Error saving invoice:', error);
      throw error;
    }
  };

  const loadInvoices = () => {
    try {
      setLoading(true);
      const db = getDatabase();

      const rows = db.getAllSync<Invoice>(
        `SELECT * FROM invoices ORDER BY created_at DESC`
      );

      const invoicesWithItems = rows.map((invoice) => {
        const items = db.getAllSync<InvoiceItem>(
          `SELECT * FROM invoice_items WHERE invoice_id = ?`,
          [invoice.id]
        );
        return { ...invoice, items };
      });

      setInvoices(invoicesWithItems);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = (id: number) => {
    try {
      const db = getDatabase();
      db.runSync(`DELETE FROM invoices WHERE id = ?`, [id]);
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  return { invoices, loading, saveInvoice, loadInvoices, deleteInvoice };
}

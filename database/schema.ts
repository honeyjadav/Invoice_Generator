import { getDatabase } from './db';

export function initializeDatabase() {
  const db = getDatabase();

  // Profile table for business details
  db.execSync(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT NOT NULL DEFAULT '',
      address TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      email TEXT DEFAULT '',
      gstin TEXT DEFAULT ''
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_number TEXT NOT NULL,
      invoice_date TEXT NOT NULL,
      business_name TEXT NOT NULL,
      business_address TEXT,
      business_phone TEXT,
      business_email TEXT,
      business_gstin TEXT,
      customer_name TEXT,
      customer_address TEXT,
      customer_phone TEXT,
      customer_email TEXT,
      customer_gstin TEXT,
      subtotal REAL NOT NULL,
      cgst REAL NOT NULL,
      sgst REAL NOT NULL,
      igst REAL NOT NULL DEFAULT 0,
      tax_mode TEXT NOT NULL DEFAULT 'cgst_sgst',
      total REAL NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  db.execSync(`
    CREATE TABLE IF NOT EXISTS invoice_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      quantity REAL NOT NULL,
      rate REAL NOT NULL,
      amount REAL NOT NULL,
      FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
    );
  `);
}

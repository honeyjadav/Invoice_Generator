export interface ValidationErrors {
  invoiceDate?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerGstin?: string;
  products?: string;
}

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(\+91[\-\s]?)?[6-9]\d{9}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function validateInvoice(
  invoiceDate: string,
  customer: { name: string; phone: string; email: string; gstin: string },
  products: { name: string; quantity: string; rate: string }[]
): ValidationErrors {
  const errors: ValidationErrors = {};

  // Date
  if (!DATE_REGEX.test(invoiceDate)) {
    errors.invoiceDate = 'Date must be in YYYY-MM-DD format';
  } else {
    const d = new Date(invoiceDate);
    if (isNaN(d.getTime())) errors.invoiceDate = 'Invalid date';
  }

  // Customer name (required)
  if (!customer.name.trim()) {
    errors.customerName = 'Customer name is required';
  }

  // Phone (optional but validated if filled)
  if (customer.phone.trim() && !PHONE_REGEX.test(customer.phone.trim())) {
    errors.customerPhone = 'Enter a valid 10-digit Indian mobile number';
  }

  // Email (optional but validated if filled)
  if (customer.email.trim() && !EMAIL_REGEX.test(customer.email.trim())) {
    errors.customerEmail = 'Enter a valid email address';
  }

  // GSTIN (optional but validated if filled)
  if (customer.gstin.trim() && !GSTIN_REGEX.test(customer.gstin.trim().toUpperCase())) {
    errors.customerGstin = 'Invalid GSTIN format (e.g. 22AAAAA0000A1Z5)';
  }

  // Products — at least one valid row
  const validProducts = products.filter(
    (p) => p.name.trim() && parseFloat(p.quantity) > 0 && parseFloat(p.rate) > 0
  );
  if (validProducts.length === 0) {
    errors.products = 'Add at least one product with name, quantity and rate';
  }

  return errors;
}

export const hasErrors = (errors: ValidationErrors) => Object.keys(errors).length > 0;
import { Product, TaxMode } from '../types/types';

export default function calculateTotals(products: Product[], taxMode: TaxMode = 'cgst_sgst') {
  const subtotal = products.reduce(
    (sum, product) => sum + (product.amount || 0),
    0
  );

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (taxMode === 'cgst_sgst') {
    cgst = subtotal * 0.09; // 9%
    sgst = subtotal * 0.09; // 9%
  } else {
    igst = subtotal * 0.18; // 18%
  }

  const total = subtotal + cgst + sgst + igst;

  return { subtotal, cgst, sgst, igst, total, taxMode };
}

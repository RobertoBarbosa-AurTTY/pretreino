/**
 * Challenge 2: Sales Report
 * 
 * Service for generating sales reports.
 */

interface Sale {
  id: string;
  seller: string;
  product: string;
  amount: number;
  date: string;
}

interface SellerReport {
  seller: string;
  totalSales: number;
  salesCount: number;
  averageTicket: number;
}

interface CompleteReport {
  period: { start: string; end: string };
  sellers: SellerReport[];
  topSellers: SellerReport[];
  overallTotal: number;
}

/**
 * Loads sales from a CSV file
 */
export async function loadSales(filePath: string): Promise<Sale[]> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Filters sales by period
 */
export function filterByPeriod(
  sales: Sale[],
  start: string,
  end: string
): Sale[] {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Generates report per seller
 */
export function generateReport(
  sales: Sale[],
  start: string,
  end: string
): CompleteReport {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Exports data to CSV
 */
export async function exportCSV(
  data: SellerReport[],
  fileName: string
): Promise<void> {
  // TODO: Implement
  throw new Error("Not implemented");
}
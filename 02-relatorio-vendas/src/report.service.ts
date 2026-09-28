/**
 * Challenge 2: Sales Report
 *
 * Service for generating sales reports.
 */

export interface Sale {
  id: string;
  seller: string;
  product: string;
  amount: number;
  date: string;
}

export interface SellerReport {
  seller: string;
  totalSales: number;
  salesCount: number;
  averageTicket: number;
}

export interface CompleteReport {
  period: { start: string; end: string };
  sellers: SellerReport[];
  topSellers: SellerReport[];
  overallTotal: number;
}

/**
 * Loads sales from a CSV file (separator ";", first line is the header)
 */
export async function loadSales(filePath: string): Promise<Sale[]> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Filters sales by period (start and end dates are inclusive)
 */
export function filterByPeriod(
  sales: Sale[],
  start: string,
  end: string,
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
  end: string,
): CompleteReport {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Exports data to CSV
 */
export async function exportCSV(
  data: SellerReport[],
  fileName: string,
): Promise<void> {
  // TODO: Implement
  throw new Error("Not implemented");
}

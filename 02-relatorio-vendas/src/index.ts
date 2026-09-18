/**
 * Challenge 2: Sales Report
 * 
 * Generate reports with filters, aggregations and CSV export.
 */

import { 
  loadSales, 
  generateReport, 
  exportCSV 
} from "./report.service.ts";

/**
 * Main pipeline
 */
async function executeReport(): Promise<void> {
  console.log("Generating sales report...");
  
  try {
    // .env configurations
    const startDate = Deno.env.get("DATA_INICIO") || "2024-01-01";
    const endDate = Deno.env.get("DATA_FIM") || "2024-01-31";
    const salesFile = Deno.env.get("ARQUIVO_ENTRADA") || "./data/vendas.csv";
    const outputFile = Deno.env.get("ARQUIVO_VENDAS") || "./output/relatorio-vendas.csv";
    
    console.log(`Period: ${startDate} to ${endDate}`);
    
    // TODO: Implement pipeline
    // 1. Load sales from CSV
    // 2. Generate report
    // 3. Export to CSV
    
    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
}

// Execution
executeReport();
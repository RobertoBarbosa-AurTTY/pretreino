/**
 * Challenge 4: CSV Import
 * 
 * Service that imports data from CSV, validates and processes it.
 */

import { importCSV } from "./importer.service.ts";

/**
 * Generates errors report
 */
async function generateErrorReport(
  errors: Array<{ line: number; field: string; error: string; value: string }>,
  outputPath: string
): Promise<void> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Main pipeline
 */
async function executeImport(): Promise<void> {
  console.log("Starting CSV import...");
  
  try {
    // .env configurations
    const importFolder = Deno.env.get("PASTA_IMPORTACAO") || "./data";
    const inputFile = Deno.env.get("ARQUIVO_ENTRADA") || "clientes.csv";
    const errorsFolder = Deno.env.get("PASTA_ERROS") || "./data/erros";
    
    const filePath = `${importFolder}/${inputFile}`;
    
    console.log(`File: ${filePath}`);
    
    // TODO: Implement pipeline
    // 1. Import and validate
    // 2. Show results
    // 3. Generate errors report
    
    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error on import:", error);
    throw error;
  }
}

// Execution
executeImport();
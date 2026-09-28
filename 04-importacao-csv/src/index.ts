/**
 * Challenge 4: CSV Import
 *
 * Service that imports data from CSV, validates and processes it.
 */

import { importCSV, type ImportError } from "./importer.service.ts";

/**
 * Generates errors report (one line per error)
 */
async function generateErrorReport(
  errors: ImportError[],
  outputPath: string,
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
    const errorsFolder = Deno.env.get("PASTA_ERROS") || "./output";
    const errorsFile = Deno.env.get("ARQUIVO_ERROS") || "erros-importacao.log";

    const filePath = `${importFolder}/${inputFile}`;

    console.log(`File: ${filePath}`);

    // TODO: Implement pipeline
    // 1. Import and validate
    // 2. Show results
    // 3. Generate errors report at `${errorsFolder}/${errorsFile}`

    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error on import:", error);
    throw error;
  }
}

// Execution
executeImport();

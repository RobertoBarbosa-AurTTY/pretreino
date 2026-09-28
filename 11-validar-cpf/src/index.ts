/**
 * Challenge 11: Validate CPF
 *
 * CPF validation and generation service.
 */

import {
  formatCpf,
  generateCpf,
  readCpfsFromFile,
  saveCpfsToFile,
  validateCpf,
  validateCpfList,
} from "./cpf.service.ts";

/**
 * Main pipeline
 */
async function runValidation(): Promise<void> {
  console.log("Starting CPF validation...");

  try {
    // Settings from .env
    const mode = Deno.env.get("MODE") || "validate";
    const generateCount = parseInt(Deno.env.get("GENERATE_COUNT") || "100");
    const inputFile = Deno.env.get("INPUT_FILE") || "./data/cpfs-validos.txt";
    const outputFile = Deno.env.get("OUTPUT_FILE") ||
      "./data/cpfs-gerados.txt";

    console.log(`Mode: ${mode}`);

    // TODO: Implement pipeline
    // 1. "validate" mode: read CPFs from inputFile and print valid/invalid
    // 2. "generate" mode: generate `generateCount` CPFs and save to outputFile

    throw new Error("Not implemented");
  } catch (error) {
    console.error("Validation error:", error);
    throw error;
  }
}

// Execution
runValidation();

/**
 * Challenge 5: Stock Monitoring
 *
 * System that monitors stock and sends alerts.
 */

import {
  applyMovements,
  checkStock,
  loadMovements,
  loadProducts,
  sendAlert,
} from "./stock.service.ts";

/**
 * Main pipeline
 */
async function executeMonitoring(): Promise<void> {
  console.log("Starting stock monitoring...");

  try {
    // .env configurations
    const productsFile = Deno.env.get("ARQUIVO_PRODUTOS") ||
      "./data/produtos.json";
    const movementsFile = Deno.env.get("ARQUIVO_MOVIMENTACOES") ||
      "./data/movimentacoes.json";

    console.log(`Products file: ${productsFile}`);
    console.log(`Movements file: ${movementsFile}`);

    // TODO: Implement pipeline
    // 1. Load products and movements
    // 2. Apply movements (log each one)
    // 3. Check stock and generate alerts
    // 4. Send alerts and show results

    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error on monitoring:", error);
    throw error;
  }
}

// Execution
executeMonitoring();

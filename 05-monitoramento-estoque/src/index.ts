/**
 * Challenge 5: Stock Monitoring
 * 
 * System that monitors stock and sends alerts.
 */

import { 
  loadProducts, 
  checkStock, 
  sendAlert 
} from "./stock.service.ts";

/**
 * Main pipeline
 */
async function executeMonitoring(): Promise<void> {
  console.log("Starting stock monitoring...");
  
  try {
    // .env configurations
    const productsFile = Deno.env.get("ARQUIVO_PRODUTOS") || "./data/produtos.json";
    
    console.log(`Products file: ${productsFile}`);
    
    // TODO: Implement pipeline
    // 1. Load products
    // 2. Check stock and generate alerts
    // 3. Show results
    
    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error on monitoring:", error);
    throw error;
  }
}

// Execution
executeMonitoring();
/**
 * Challenge 9: Queue Processing
 * 
 * Async task processing system with queue and workers.
 */

import { Queue } from "./queue.service.ts";

/**
 * Loads tasks from file
 */
async function loadTasks(filePath: string): Promise<Array<Omit<unknown, "id" | "status" | "attempts" | "maxAttempts" | "createdAt">>> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Main pipeline
 */
async function executeQueue(): Promise<void> {
  console.log("Starting queue system...");
  
  try {
    // .env configurations
    const maxWorkers = parseInt(Deno.env.get("MAX_WORKERS") || "3");
    const maxAttempts = parseInt(Deno.env.get("MAX_TENTATIVAS") || "3");
    const retryDelay = parseInt(Deno.env.get("DELAY_RETRY") || "1000");
    const processingTimeout = parseInt(Deno.env.get("TIMEOUT_PROCESSAMENTO") || "30000");
    const tasksFile = Deno.env.get("ARQUIVO_TAREFAS") || "./data/fila-tarefas.json";
    
    console.log(`Workers: ${maxWorkers}`);
    console.log(`Max attempts: ${maxAttempts}`);
    
    // Create queue
    const queue = new Queue({
      maxWorkers,
      maxAttempts,
      retryDelay,
      processingTimeout
    });
    
    // TODO: Implement pipeline
    // 1. Load tasks
    // 2. Add tasks to the queue
    // 3. Process queue
    // 4. Show results
    
    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error on processing:", error);
    throw error;
  }
}

// Execution
executeQueue();
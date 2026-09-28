/**
 * Challenge 9: Queue Processing
 *
 * Async task processing system with queue and workers.
 */

import { type NewTask, Queue } from "./queue.service.ts";

/**
 * Loads tasks from file
 */
async function loadTasks(filePath: string): Promise<NewTask[]> {
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
    const processingTimeout = parseInt(
      Deno.env.get("TIMEOUT_PROCESSAMENTO") || "30000",
    );
    const tasksFile = Deno.env.get("ARQUIVO_TAREFAS") ||
      "./data/fila-tarefas.json";

    console.log(`Workers: ${maxWorkers}`);
    console.log(`Max attempts: ${maxAttempts}`);

    // Create queue
    const queue = new Queue({
      maxWorkers,
      maxAttempts,
      retryDelay,
      processingTimeout,
    });

    // TODO: Implement pipeline
    // 1. Register a simulated handler for each task type
    //    ("enviar_email", "processar_imagem", "gerar_relatorio")
    // 2. Load tasks
    // 3. Add tasks to the queue
    // 4. Process queue
    // 5. Show results and queue status

    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error on processing:", error);
    throw error;
  }
}

// Execution
executeQueue();

/**
 * Desafio 48: Task Scheduler
 */

import { Scheduler, criarScheduler } from "./scheduler.service.ts";

async function executar(): Promise<void> {
  console.log("Iniciando Task Scheduler...");
  try {
    const scheduler = criarScheduler();
    console.log("Scheduler criado");
    // TODO: Implementar
    throw new Error("Não implementado");
  } catch (error) {
    console.error("Erro:", error);
    throw error;
  }
}

executar();
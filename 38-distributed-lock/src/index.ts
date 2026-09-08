/**
 * Desafio 38: Distributed Lock
 */

import { DistributedLock, criarLock } from "./lock.service.ts";

async function executar(): Promise<void> {
  console.log("Iniciando Distributed Lock...");
  try {
    const lock = criarLock({ timeout: 30000, retries: 3, retryDelay: 100 });
    console.log("Lock criado");
    // TODO: Implementar
    throw new Error("Não implementado");
  } catch (error) {
    console.error("Erro:", error);
    throw error;
  }
}

executar();
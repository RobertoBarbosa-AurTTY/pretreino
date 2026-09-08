/**
 * Desafio 33: Event Sourcing
 */

import { EventStore, criarEventStore } from "./eventstore.service.ts";

async function executar(): Promise<void> {
  console.log("Iniciando Event Sourcing...");
  try {
    const store = criarEventStore();
    console.log("Event Store criado");
    // TODO: Implementar
    throw new Error("Não implementado");
  } catch (error) {
    console.error("Erro:", error);
    throw error;
  }
}

executar();
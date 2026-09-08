/**
 * Desafio 40: Event Driven Architecture
 */

import { EventBus, criarEventBus } from "./eventbus.service.ts";

async function executar(): Promise<void> {
  console.log("Iniciando Event Driven...");
  try {
    const bus = criarEventBus();
    console.log("Event Bus criado");
    // TODO: Implementar
    throw new Error("Não implementado");
  } catch (error) {
    console.error("Erro:", error);
    throw error;
  }
}

executar();
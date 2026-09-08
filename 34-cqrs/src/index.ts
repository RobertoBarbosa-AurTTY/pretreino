/**
 * Desafio 34: CQRS
 */

import { CommandBus, QueryBus } from "./cqrs.service.ts";

async function executar(): Promise<void> {
  console.log("Iniciando CQRS...");
  try {
    const commandBus = new CommandBus();
    const queryBus = new QueryBus();
    console.log("Buses criados");
    // TODO: Implementar
    throw new Error("Não implementado");
  } catch (error) {
    console.error("Erro:", error);
    throw error;
  }
}

executar();
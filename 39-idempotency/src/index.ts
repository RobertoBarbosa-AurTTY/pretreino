/**
 * Desafio 39: Idempotency
 */

import { IdempotencyService, criarServico } from "./idempotency.service.ts";

async function executar(): Promise<void> {
  console.log("Iniciando Idempotency...");
  try {
    const service = criarServico(3600000);
    console.log("Serviço criado");
    // TODO: Implementar
    throw new Error("Não implementado");
  } catch (error) {
    console.error("Erro:", error);
    throw error;
  }
}

executar();
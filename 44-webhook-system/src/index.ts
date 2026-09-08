/**
 * Desafio 44: Webhook System
 */

import { WebhookService, criarServico } from "./webhook.service.ts";

async function executar(): Promise<void> {
  console.log("Iniciando Webhook System...");
  try {
    const service = criarServico();
    console.log("Serviço criado");
    // TODO: Implementar
    throw new Error("Não implementado");
  } catch (error) {
    console.error("Erro:", error);
    throw error;
  }
}

executar();
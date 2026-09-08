/**
 * Desafio 45: Notification System
 */

import { NotificationService, criarServico } from "./notification.service.ts";

async function executar(): Promise<void> {
  console.log("Iniciando Notification System...");
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
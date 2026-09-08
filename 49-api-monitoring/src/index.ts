/**
 * Desafio 49: API Monitoring
 */

import { MonitoringService, criarServico } from "./monitoring.service.ts";

async function executar(): Promise<void> {
  console.log("Iniciando API Monitoring...");
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
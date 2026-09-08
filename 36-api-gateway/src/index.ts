/**
 * Desafio 36: API Gateway
 */

import { Gateway, criarGateway } from "./gateway.service.ts";

async function executar(): Promise<void> {
  console.log("Iniciando API Gateway...");
  try {
    const gateway = criarGateway({
      routes: [
        { path: "/api/users", service: "http://localhost:3001" },
        { path: "/api/orders", service: "http://localhost:3002" }
      ]
    });
    console.log("Gateway criado");
    // TODO: Implementar
    throw new Error("Não implementado");
  } catch (error) {
    console.error("Erro:", error);
    throw error;
  }
}

executar();
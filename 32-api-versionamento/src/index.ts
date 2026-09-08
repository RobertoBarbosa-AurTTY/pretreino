/**
 * Desafio 32: Versionamento de API
 */

import { criarRouter } from "./versioning.service.ts";

async function executar(): Promise<void> {
  console.log("Iniciando API com versionamento...");
  try {
    const port = parseInt(Deno.env.get("PORT") || "3000");
    console.log(`Porta: ${port}`);
    // TODO: Implementar
    throw new Error("Não implementado");
  } catch (error) {
    console.error("Erro:", error);
    throw error;
  }
}

executar();
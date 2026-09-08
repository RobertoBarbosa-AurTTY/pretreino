/**
 * Desafio 43: Response Caching
 */

import { ResponseCache, criarCache } from "./cache.service.ts";

async function executar(): Promise<void> {
  console.log("Iniciando Response Caching...");
  try {
    const cache = criarCache({ ttl: 60000, maxSize: 1000, strategy: "lru" });
    console.log("Cache criado");
    // TODO: Implementar
    throw new Error("Não implementado");
  } catch (error) {
    console.error("Erro:", error);
    throw error;
  }
}

executar();
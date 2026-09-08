/**
 * Desafio 47: Search Engine
 */

import { SearchEngine, criarEngine } from "./search.service.ts";

async function executar(): Promise<void> {
  console.log("Iniciando Search Engine...");
  try {
    const engine = criarEngine();
    console.log("Engine criado");
    // TODO: Implementar
    throw new Error("Não implementado");
  } catch (error) {
    console.error("Erro:", error);
    throw error;
  }
}

executar();
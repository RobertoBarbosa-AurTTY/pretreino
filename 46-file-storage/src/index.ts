/**
 * Desafio 46: File Storage
 */

import { FileStorage, criarStorage } from "./storage.service.ts";

async function executar(): Promise<void> {
  console.log("Iniciando File Storage...");
  try {
    const storage = criarStorage({ basePath: "./uploads" });
    console.log("Storage criado");
    // TODO: Implementar
    throw new Error("Não implementado");
  } catch (error) {
    console.error("Erro:", error);
    throw error;
  }
}

executar();
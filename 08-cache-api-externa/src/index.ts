/**
 * Desafio 8: Cache de API Externa
 * 
 * Sistema de cache para chamadas a APIs externas.
 * A Mock API deve estar rodando: cd ../mock-api && deno task dev
 */

import { Cache, buscarUsuarios, buscarProdutos } from "./cache.service.ts";

/**
 * Pipeline principal
 */
async function executarCache(): Promise<void> {
  console.log("Iniciando demonstração de cache...");
  
  try {
    // Configurações do .env
    const apiUrl = Deno.env.get("API_EXTERNA_URL") || "http://localhost:8080";
    const ttl = parseInt(Deno.env.get("CACHE_TTL") || "300");
    const maxEntradas = parseInt(Deno.env.get("CACHE_MAX_ENTRIES") || "1000");
    
    console.log(`API URL: ${apiUrl}`);
    console.log(`TTL: ${ttl}s`);
    
    // Criar instância do cache
    const cache = new Cache<unknown[]>({
      ttlPadrao: ttl,
      maxEntradas,
      persistir: false
    });
    
    // TODO: Implementar demonstração
    // 1. Buscar dados com e sem cache
    // 2. Exibir estatísticas
    // 3. Invalidar cache
    
    throw new Error("Não implementado");
  } catch (error) {
    console.error("Erro na demonstração:", error);
    throw error;
  }
}

// Execução
executarCache();

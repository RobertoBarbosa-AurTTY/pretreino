/**
 * Desafio 25: API GraphQL
 * 
 * API GraphQL completa com resolvers e subscriptions.
 */

import {
  criarSchema,
  executarQuery,
  executarMutation,
 订阅Subscription
} from "./graphql.service.ts";

/**
 * Pipeline principal
 */
async function executarGraphQL(): Promise<void> {
  console.log("Iniciando API GraphQL...");
  
  try {
    // Configurações do .env
    const port = parseInt(Deno.env.get("PORT") || "4000");
    const playground = Deno.env.get("PLAYGROUND") !== "false";
    
    console.log(`Porta: ${port}`);
    console.log(`Playground: ${playground}`);
    
    // TODO: Implementar pipeline
    // 1. Criar schema
    // 2. Configurar resolvers
    // 3. Executar queries
    // 4. Configurar subscriptions
    
    throw new Error("Não implementado");
  } catch (error) {
    console.error("Erro no GraphQL:", error);
    throw error;
  }
}

// Execução
executarGraphQL();
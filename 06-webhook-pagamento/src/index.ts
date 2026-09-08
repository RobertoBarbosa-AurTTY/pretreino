/**
 * Desafio 6: Webhook de Pagamento
 * 
 * Serviço que envia webhooks de pagamento para a Mock API.
 * A Mock API deve estar rodando: cd ../mock-api && deno task dev
 */

import { 
  enviarWebhook, 
  carregarWebhooksPendentes,
  validarWebhook 
} from "./webhook.handler.ts";

/**
 * Pipeline principal
 */
async function executarServicoWebhook(): Promise<void> {
  console.log("Iniciando serviço de webhook de pagamento...");
  
  try {
    // Configurações do .env
    const apiUrl = Deno.env.get("API_BASE_URL") || "http://localhost:8080";
    const webhookSecret = Deno.env.get("WEBHOOK_SECRET") || "seu_secret_aqui";
    const arquivoWebhooks = Deno.env.get("ARQUIVO_WEBHOOKS") || "./data/exemplo-webhook.json";
    
    console.log(`API URL: ${apiUrl}`);
    
    // TODO: Implementar pipeline
    // 1. Carregar webhooks pendentes
    // 2. Validar e enviar webhooks
    // 3. Exibir resultados
    
    throw new Error("Não implementado");
  } catch (error) {
    console.error("Erro no serviço de webhook:", error);
    throw error;
  }
}

// Execução
executarServicoWebhook();

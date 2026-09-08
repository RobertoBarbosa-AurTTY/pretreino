/**
 * Desafio 3: Notificação por Email
 * 
 * Sistema de envio de emails com fila, retry e templates.
 * A Mock API deve estar rodando: cd ../mock-api && deno task dev
 */

import { 
  carregarEmailsPendentes, 
  processarFila 
} from "./email.service.ts";

/**
 * Pipeline principal
 */
async function executarServicoEmail(): Promise<void> {
  console.log("Iniciando serviço de email...");
  
  try {
    // Configurações do .env
    const apiUrl = Deno.env.get("API_BASE_URL") || "http://localhost:8080";
    const maxTentativas = parseInt(Deno.env.get("FILA_MAX_TENTATIVAS") || "3");
    const delayRetry = parseInt(Deno.env.get("FILA_DELAY_RETRY") || "1000");
    const timeoutEnvio = parseInt(Deno.env.get("FILA_TIMEOUT_ENVIO") || "30000");
    const arquivoEmails = Deno.env.get("ARQUIVO_EMAILS") || "./data/emails-pendentes.json";
    
    console.log(`API URL: ${apiUrl}`);
    console.log(`Max tentativas: ${maxTentativas}`);
    
    // TODO: Implementar pipeline
    // 1. Carregar emails pendentes
    // 2. Processar fila
    // 3. Exibir resumo
    
    throw new Error("Não implementado");
  } catch (error) {
    console.error("Erro no serviço de email:", error);
    throw error;
  }
}

// Execução
executarServicoEmail();

/**
 * Desafio 3: Notificação por Email
 * 
 * Serviço de envio de emails com fila e retry.
 * A Mock API deve estar rodando: cd ../mock-api && deno task dev
 */

interface Email {
  id: string;
  para: string;
  assunto: string;
  template: string;
  dados: Record<string, unknown>;
  status: "pendente" | "enviado" | "falha";
  tentativas: number;
}

interface ConfiguracaoFila {
  maxTentativas: number;
  delayRetry: number;
  timeoutEnvio: number;
}

interface ResultadoEnvio {
  success: boolean;
  emailId: string;
  erro?: string;
}

/**
 * Envia email via Mock API
 */
export async function enviarEmailViaAPI(
  email: Omit<Email, "id" | "status" | "tentativas">,
  apiUrl: string
): Promise<ResultadoEnvio> {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Enfileira email para envio
 */
export async function enfileirarEmail(
  email: Email,
  fila: Email[]
): Promise<void> {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Processa fila de emails
 */
export async function processarFila(
  fila: Email[],
  config: ConfiguracaoFila,
  apiUrl: string
): Promise<ResultadoEnvio[]> {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Carrega emails pendentes de arquivo
 */
export async function carregarEmailsPendentes(caminhoArquivo: string): Promise<Email[]> {
  // TODO: Implementar
  throw new Error("Não implementado");
}

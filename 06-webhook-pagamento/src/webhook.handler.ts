/**
 * Desafio 6: Webhook de Pagamento
 * 
 * Serviço que envia webhooks de pagamento para a Mock API.
 * A Mock API deve estar rodando: cd ../mock-api && deno task dev
 */

interface WebhookPagamento {
  evento: "pagamento.pago" | "pagamento.falhou" | "pagamento.reembolsado";
  dados: {
    pagamentoId: string;
    pedidoId: string;
    valor: number;
    metodo: string;
    data: string;
  };
}

interface ResultadoProcessamento {
  success: boolean;
  mensagem: string;
  pagamentoId?: string;
}

/**
 * Envia webhook de pagamento para a Mock API
 */
export async function enviarWebhook(
  webhook: WebhookPagamento,
  apiUrl: string,
  secret: string
): Promise<ResultadoProcessamento> {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Carrega webhooks pendentes de arquivo
 */
export async function carregarWebhooksPendentes(
  caminhoArquivo: string
): Promise<WebhookPagamento[]> {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Valida estrutura do webhook
 */
export function validarWebhook(webhook: unknown): webhook is WebhookPagamento {
  // TODO: Implementar
  throw new Error("Não implementado");
}

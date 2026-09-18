/**
 * Challenge 6: Payment Webhook
 * 
 * Service that sends payment webhooks to the Mock API.
 * The Mock API must be running: cd ../mock-api && deno task dev
 */

interface PaymentWebhook {
  event: "pagamento.pago" | "pagamento.falhou" | "pagamento.reembolsado";
  data: {
    paymentId: string;
    orderId: string;
    amount: number;
    method: string;
    date: string;
  };
}

interface ProcessingResult {
  success: boolean;
  message: string;
  paymentId?: string;
}

/**
 * Sends payment webhook to the Mock API
 */
export async function sendWebhook(
  webhook: PaymentWebhook,
  apiUrl: string,
  secret: string
): Promise<ProcessingResult> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Loads pending webhooks from file
 */
export async function loadPendingWebhooks(
  filePath: string
): Promise<PaymentWebhook[]> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Validates webhook structure
 */
export function validateWebhook(webhook: unknown): webhook is PaymentWebhook {
  // TODO: Implement
  throw new Error("Not implemented");
}
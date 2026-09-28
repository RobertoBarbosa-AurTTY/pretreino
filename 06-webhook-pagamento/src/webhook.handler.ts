/**
 * Challenge 6: Payment Webhook
 *
 * Service that sends payment webhooks to the Mock API.
 * API docs: ../API.md
 */

export interface PaymentWebhook {
  event: "pagamento.pago" | "pagamento.falhou" | "pagamento.reembolsado";
  data: {
    paymentId: string;
    orderId: string;
    amount: number;
    method: string;
    date: string;
  };
}

export interface ProcessingResult {
  success: boolean;
  message: string;
  paymentId?: string;
}

/**
 * Authenticates on the Mock API and returns the Bearer token
 */
export async function login(
  apiUrl: string,
  email: string,
  password: string,
): Promise<string> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Sends payment webhook to the Mock API (POST /api/webhooks)
 */
export async function sendWebhook(
  webhook: PaymentWebhook,
  apiUrl: string,
  secret: string,
  token: string,
): Promise<ProcessingResult> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Loads pending webhooks from file (only valid ones)
 */
export async function loadPendingWebhooks(
  filePath: string,
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

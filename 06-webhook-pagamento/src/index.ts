/**
 * Challenge 6: Payment Webhook
 *
 * Service that sends payment webhooks to the Mock API.
 * API docs: ../API.md
 */

import {
  loadPendingWebhooks,
  login,
  sendWebhook,
  validateWebhook,
} from "./webhook.handler.ts";

/**
 * Main pipeline
 */
async function executeWebhookService(): Promise<void> {
  console.log("Starting payment webhook service...");

  try {
    // .env configurations
    const apiUrl = Deno.env.get("API_BASE_URL") ||
      "https://api-mock-98te.onrender.com";
    const apiEmail = Deno.env.get("API_EMAIL") || "joao@email.com";
    const apiPassword = Deno.env.get("API_PASSWORD") || "123456";
    const webhookSecret = Deno.env.get("WEBHOOK_SECRET") || "your_secret_here";
    const webhooksFile = Deno.env.get("ARQUIVO_WEBHOOKS") ||
      "./data/exemplo-webhook.json";

    console.log(`API URL: ${apiUrl}`);

    // TODO: Implement pipeline
    // 1. Log in to get the token
    // 2. Load pending webhooks
    // 3. Send each webhook once (skip repeated paymentId)
    // 4. Show results

    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error in webhook service:", error);
    throw error;
  }
}

// Execution
executeWebhookService();

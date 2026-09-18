/**
 * Challenge 6: Payment Webhook
 * 
 * Service that sends payment webhooks to the Mock API.
 * The Mock API must be running: cd ../mock-api && deno task dev
 */

import { 
  sendWebhook, 
  loadPendingWebhooks,
  validateWebhook 
} from "./webhook.handler.ts";

/**
 * Main pipeline
 */
async function executeWebhookService(): Promise<void> {
  console.log("Starting payment webhook service...");
  
  try {
    // .env configurations
    const apiUrl = Deno.env.get("API_BASE_URL") || "http://localhost:8080";
    const webhookSecret = Deno.env.get("WEBHOOK_SECRET") || "your_secret_here";
    const webhooksFile = Deno.env.get("ARQUIVO_WEBHOOKS") || "./data/exemplo-webhook.json";
    
    console.log(`API URL: ${apiUrl}`);
    
    // TODO: Implement pipeline
    // 1. Load pending webhooks
    // 2. Validate and send webhooks
    // 3. Show results
    
    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error in webhook service:", error);
    throw error;
  }
}

// Execution
executeWebhookService();
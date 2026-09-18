/**
 * Challenge 3: Email Notification
 * 
 * Email sending system with queue, retry and templates.
 * The Mock API must be running: cd ../mock-api && deno task dev
 */

import { 
  loadPendingEmails, 
  processQueue 
} from "./email.service.ts";

/**
 * Main pipeline
 */
async function executeEmailService(): Promise<void> {
  console.log("Starting email service...");
  
  try {
    // .env configurations
    const apiUrl = Deno.env.get("API_BASE_URL") || "http://localhost:8080";
    const maxAttempts = parseInt(Deno.env.get("FILA_MAX_TENTATIVAS") || "3");
    const retryDelay = parseInt(Deno.env.get("FILA_DELAY_RETRY") || "1000");
    const sendTimeout = parseInt(Deno.env.get("FILA_TIMEOUT_ENVIO") || "30000");
    const emailsFile = Deno.env.get("ARQUIVO_EMAILS") || "./data/emails-pendentes.json";
    
    console.log(`API URL: ${apiUrl}`);
    console.log(`Max attempts: ${maxAttempts}`);
    
    // TODO: Implement pipeline
    // 1. Load pending emails
    // 2. Process queue
    // 3. Show summary
    
    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error in email service:", error);
    throw error;
  }
}

// Execution
executeEmailService();
/**
 * Challenge 3: Email Notification
 *
 * Email sending system with queue, retry and templates.
 * API docs: ../API.md
 */

import {
  loadPendingEmails,
  login,
  processQueue,
  renderTemplate,
} from "./email.service.ts";

/**
 * Main pipeline
 */
async function executeEmailService(): Promise<void> {
  console.log("Starting email service...");

  try {
    // .env configurations
    const apiUrl = Deno.env.get("API_BASE_URL") ||
      "https://api-mock-98te.onrender.com";
    const apiEmail = Deno.env.get("API_EMAIL") || "joao@email.com";
    const apiPassword = Deno.env.get("API_PASSWORD") || "123456";
    const maxAttempts = parseInt(Deno.env.get("FILA_MAX_TENTATIVAS") || "3");
    const retryDelay = parseInt(Deno.env.get("FILA_DELAY_RETRY") || "1000");
    const sendTimeout = parseInt(
      Deno.env.get("FILA_TIMEOUT_ENVIO") || "30000",
    );
    const emailsFile = Deno.env.get("ARQUIVO_EMAILS") ||
      "./data/emails-pendentes.json";
    const templatesDir = Deno.env.get("PASTA_TEMPLATES") || "./src/templates";

    console.log(`API URL: ${apiUrl}`);
    console.log(`Max attempts: ${maxAttempts}`);

    // TODO: Implement pipeline
    // 1. Log in to get the token
    // 2. Load pending emails
    // 3. Render each template (log a preview)
    // 4. Process queue
    // 5. Show summary (sent / failed)

    throw new Error("Not implemented");
  } catch (error) {
    console.error("Error in email service:", error);
    throw error;
  }
}

// Execution
executeEmailService();

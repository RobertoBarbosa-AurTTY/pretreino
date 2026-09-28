/**
 * Challenge 3: Email Notification
 *
 * Email sending service with queue and retry.
 * API docs: ../API.md
 */

export interface Email {
  id: string;
  to: string;
  subject: string;
  template: string;
  data: Record<string, unknown>;
  status: "pendente" | "enviado" | "falha";
  attempts: number;
}

export interface QueueConfig {
  maxAttempts: number;
  retryDelay: number;
  sendTimeout: number;
}

export interface SendResult {
  success: boolean;
  emailId: string;
  error?: string;
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
 * Renders an HTML template from `templatesDir` replacing {{key}} with data[key]
 */
export async function renderTemplate(
  template: string,
  data: Record<string, unknown>,
  templatesDir: string,
): Promise<string> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Sends email via Mock API (POST /api/emails)
 */
export async function sendEmailViaAPI(
  email: Omit<Email, "id" | "status" | "attempts">,
  apiUrl: string,
  token: string,
  timeoutMs?: number,
): Promise<SendResult> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Queues email for sending
 */
export async function enqueueEmail(
  email: Email,
  queue: Email[],
): Promise<void> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Processes email queue
 */
export async function processQueue(
  queue: Email[],
  config: QueueConfig,
  apiUrl: string,
  token: string,
): Promise<SendResult[]> {
  // TODO: Implement
  throw new Error("Not implemented");
}

/**
 * Loads pending emails from file
 */
export async function loadPendingEmails(filePath: string): Promise<Email[]> {
  // TODO: Implement
  throw new Error("Not implemented");
}

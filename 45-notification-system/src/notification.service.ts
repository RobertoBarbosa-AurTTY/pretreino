/**
 * Challenge 45: Notification System - Service
 */

export type Channel = "email" | "sms" | "push";

export interface Notification {
  id: string;
  userId: string;
  channel: Channel;
  template: string;
  data: Record<string, unknown>;
  status: "pending" | "sent" | "failed";
  error?: string;
}

export interface UserPreferences {
  userId: string;
  channels: Channel[];
  /** Horas locais (0–23): de `start` (inclusive) até `end` (exclusive). */
  quietHours?: { start: number; end: number };
}

/** Função que efetivamente entrega a mensagem em um canal. */
export type ChannelSender = (
  notification: Notification,
  message: string,
) => Promise<void>;

export interface NotificationServiceOptions {
  senders?: Partial<Record<Channel, ChannelSender>>;
  /** Relógio injetável (padrão: `() => new Date()`). */
  now?: () => Date;
}

export interface ChannelStats {
  sent: number;
  failed: number;
}

export interface NotificationService {
  send(
    notification: Omit<Notification, "id" | "status">,
  ): Promise<Notification>;
  getPreferences(userId: string): UserPreferences;
  setPreferences(userId: string, prefs: UserPreferences): void;
  processQueue(): Promise<Notification[]>;
  getStats(): Record<Channel, ChannelStats>;
}

export function createService(
  options: NotificationServiceOptions = {},
): NotificationService {
  // TODO: Implement
  throw new Error("Not implemented");
}

export function renderTemplate(
  template: string,
  data: Record<string, unknown>,
): string {
  // TODO: Implement
  throw new Error("Not implemented");
}

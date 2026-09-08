/**
 * Desafio 45: Notification System - Service
 */

export interface Notification {
  id: string;
  userId: string;
  channel: "email" | "sms" | "push";
  template: string;
  data: Record<string, unknown>;
  status: "pending" | "sent" | "failed";
}

export interface UserPreferences {
  userId: string;
  channels: string[];
  quietHours?: { start: number; end: number };
}

export interface NotificationService {
  send(notification: Omit<Notification, "id" | "status">): Promise<Notification>;
  getPreferences(userId: string): UserPreferences;
  setPreferences(userId: string, prefs: UserPreferences): void;
}

export function criarServico(): NotificationService {
  // TODO: Implementar
  throw new Error("Não implementado");
}
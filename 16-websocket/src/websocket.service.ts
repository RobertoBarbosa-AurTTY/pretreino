/**
 * Desafio 16: WebSocket
 * 
 * Serviço de WebSocket para comunicação em tempo real.
 */

export interface WebSocketMessage {
  type: "message" | "join" | "leave" | "ping" | "pong" | "users" | "error";
  room?: string;
  content?: string;
  sender?: string;
  users?: string[];
  timestamp?: string;
}

export interface Client {
  id: string;
  ws: WebSocket;
  room: string;
  username: string;
  lastActivity: number;
}

/**
 * Gerar ID único
 */
export function gerarId(): string {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Adicionar cliente
 */
export function adicionarCliente(client: Client): void {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Remover cliente
 */
export function removerCliente(id: string): void {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Enviar mensagem para todos na sala
 */
export function broadcast(message: WebSocketMessage, excludeId?: string): void {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Enviar para cliente específico
 */
export function enviarParaCliente(clientId: string, message: WebSocketMessage): void {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Entrar em sala
 */
export function entrarNaSala(clientId: string, novaSala: string): void {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Listar usuários na sala
 */
export function listarUsuariosNaSala(room: string): string[] {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Obter estatísticas
 */
export function obterEstatisticas(): { totalClientes: number; totalSalas: number } {
  // TODO: Implementar
  throw new Error("Não implementado");
}

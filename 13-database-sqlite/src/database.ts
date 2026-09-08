/**
 * Desafio 13: Database SQLite
 * 
 * Serviço de banco de dados SQLite.
 */

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  criadoEm?: string;
  atualizadoEm?: string;
}

/**
 * Criar tabela (simulado)
 */
export function criarTabela(): void {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Listar todos os usuários
 */
export function listarTodos(): Usuario[] {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Buscar por ID
 */
export function buscarPorId(id: number): Usuario | undefined {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Criar usuário
 */
export function criar(usuario: Omit<Usuario, "id" | "criadoEm" | "atualizadoEm">): Usuario {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Atualizar usuário
 */
export function atualizar(id: number, dados: Partial<Usuario>): Usuario | null {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Deletar usuário
 */
export function deletar(id: number): boolean {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Buscar por email
 */
export function buscarPorEmail(email: string): Usuario | undefined {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Contar usuários
 */
export function contar(): number {
  // TODO: Implementar
  throw new Error("Não implementado");
}

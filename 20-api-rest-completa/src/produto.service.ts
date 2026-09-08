/**
 * Desafio 20: API REST Completa
 * 
 * Serviço de produtos com CRUD completo.
 */

export interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  categoria: string;
  estoque: number;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FilterOptions {
  search?: string;
  categoria?: string;
  minPreco?: number;
  maxPreco?: number;
  ativo?: boolean;
}

export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}

/**
 * Listar produtos com paginação, filtros e ordenação
 */
export function listarProdutos(
  page: number = 1,
  limit: number = 10,
  filters: FilterOptions = {},
  sort: SortOptions = { field: "id", direction: "asc" }
): PaginatedResult<Produto> {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Buscar produto por ID
 */
export function buscarPorId(id: number): Produto | undefined {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Criar produto
 */
export function criarProduto(dados: Omit<Produto, "id" | "criadoEm" | "atualizadoEm">): Produto {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Atualizar produto
 */
export function atualizarProduto(id: number, dados: Partial<Produto>): Produto | null {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Deletar produto
 */
export function deletarProduto(id: number): boolean {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Listar categorias
 */
export function listarCategorias(): string[] {
  // TODO: Implementar
  throw new Error("Não implementado");
}

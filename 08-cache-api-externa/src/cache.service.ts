/**
 * Desafio 8: Cache de API Externa
 * 
 * Sistema de cache para chamadas a APIs externas.
 * A Mock API deve estar rodando: cd ../mock-api && deno task dev
 */

interface CacheEntry<T> {
  chave: string;
  dados: T;
  dataExpiracao: number;
  hits: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  tamanho: number;
}

interface ConfiguracaoCache {
  ttlPadrao: number;
  maxEntradas: number;
  persistir: boolean;
}

export class Cache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private config: ConfiguracaoCache;
  private stats = { hits: 0, misses: 0 };

  constructor(config: ConfiguracaoCache) {
    this.config = config;
  }

  /**
   * Busca dados do cache
   */
  async buscar(chave: string): Promise<T | null> {
    // TODO: Implementar
    throw new Error("Não implementado");
  }

  /**
   * Salva dados no cache
   */
  async salvar(chave: string, dados: T, ttl?: number): Promise<void> {
    // TODO: Implementar
    throw new Error("Não implementado");
  }

  /**
   * Busca dados ou busca na API se não estiver em cache
   */
  async buscarOuBuscar<K>(
    chave: string,
    buscarFn: () => Promise<K>,
    ttl?: number
  ): Promise<K> {
    // TODO: Implementar
    throw new Error("Não implementado");
  }

  /**
   * Invalida entrada do cache
   */
  async invalidar(chave: string): Promise<boolean> {
    // TODO: Implementar
    throw new Error("Não implementado");
  }

  /**
   * Limpa todo o cache
   */
  async limpar(): Promise<void> {
    // TODO: Implementar
    throw new Error("Não implementado");
  }

  /**
   * Retorna estatísticas do cache
   */
  obterStats(): CacheStats {
    // TODO: Implementar
    throw new Error("Não implementado");
  }

  /**
   * Remove entrada menos usada
   */
  private removerMenosUsada(): void {
    // TODO: Implementar
    throw new Error("Não implementado");
  }
}

/**
 * Busca dados da API externa (Mock API)
 */
export async function buscarUsuarios(apiUrl: string): Promise<unknown[]> {
  // TODO: Implementar
  throw new Error("Não implementado");
}

/**
 * Busca produtos da API externa (Mock API)
 */
export async function buscarProdutos(apiUrl: string): Promise<unknown[]> {
  // TODO: Implementar
  throw new Error("Não implementado");
}

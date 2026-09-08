import fs from "fs/promises";
/**
 * Desafio 1: Integração API de Clientes
 *
 * Serviço que consome API de clientes e filtra por status.
 *
 * Implemente as funções abaixo seguindo os requisitos do README.
 */

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  status: "ativo" | "inativo" | "pendente";
  dataCadastro: string;
}

export interface ConfiguracaoAPI {
  url: string;
  timeout?: number;
  retries?: number;
}

/**
 * Busca lista de clientes na API
 *
 * Requisitos:
 * - Consumir API REST com fetch()
 * - Tratar erros de rede e HTTP
 * - Implementar retry em caso de falha
 * - Implementar timeout na requisição
 * - Validar a resposta da API antes de processar
 */
export async function buscarClientes(
  config: ConfiguracaoAPI,
): Promise<Cliente[]> {
  try {
    const response = await fetch(`${config.url}/api/clientes`);
    if (!response.ok) {
      throw new Error(`Error status: ${response.status}`);
    }
    const clientes = response.json();
    return clientes;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

/**
 * Filtra clientes ativos
 *
 * Requisito:
 * - Filtrar clientes por status === "ativo"
 */
export function filtrarAtivos(clientes: Cliente[]): Cliente[] {
  try {
    if (!clientes) {
      throw new Error("error ao filtrar clientes");
    }
    return clientes.filter((c) => c.status === "ativo");
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

/**
 * Salva dados em arquivo JSON
 *
 * Requisito:
 * - Salvar resultado em arquivo JSON
 */
export async function salvarEmArquivo(
  dados: Cliente[],
  nomeArquivo: string = "clientes.json",
): Promise<void> {
  try {
    if (!dados) {
      throw new Error("Error dados nao informados");
    }
    await fs.writeFile(
      `${nomeArquivo}.json`,
      JSON.stringify(dados, null, 2),
      "utf-8",
    );
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}
